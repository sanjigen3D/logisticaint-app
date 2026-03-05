import { EditCompanyForm } from '@/components/forms/admin/EditCompanyForm';
import AdaptiveModal from '@/components/UI/AdaptiveModal';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import ItemCard from '@/components/UI/ItemCard';
import SearchBar from '@/components/UI/SearchBar';
import { SelectDropdown } from '@/components/UI/SelectDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company } from '@/lib/types/types';
import { Redirect, useRouter } from 'expo-router';
import { Building } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export default function CompaniesScreen() {
    const { isManagerOrHigher, user, token } = useAuth();
    const router = useRouter();
    const { showToast } = useToastStore();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { width } = useWindowDimensions();

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterActive, setFilterActive] = useState<string | number>('all'); // 'all', 1 (Active)

    const getNumColumns = () => {
        if (width >= 1024) return 3; // lg
        if (width >= 768) return 2;  // md
        return 1;                    // sm/mobile
    };

    const numColumns = getNumColumns();

    const isSuperAdmin = user?.company_name?.toLowerCase().includes('sanjigen');

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isSuperAdmin]); // Trigger based on `isSuperAdmin` to ensure right endpoints

    const fetchData = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const endpoint = isSuperAdmin
                ? `${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}`
                : `${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}/${user.company_id}`;

            const res = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                // console.error("Respuesta no es JSON:", text);
                showToast({
                    type: 'error',
                    message: 'Error de servidor',
                    description: 'La respuesta no tiene el formato esperado (JSON).',
                });
                return;
            }

            const data = await res.json();
            if (data.success) {
                // If it's a single object (non-superadmin), wrap it in an array
                setCompanies(Array.isArray(data.data) ? data.data : [data.data]);
            } else {
                showToast({ type: 'error', message: 'Error', description: data.message });
            }
        } catch (error) {
            console.error(error);
            showToast({
                type: 'error',
                message: 'Error de red',
                description: 'No se pudieron cargar las empresas.',
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingCompany) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}/${deletingCompany.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                showToast({
                    type: 'success',
                    message: 'Empresa eliminada',
                    description: 'La empresa y sus contactos asociados han sido eliminados correctamente.',
                });
                fetchData();
            } else {
                showToast({ type: 'error', message: 'Error', description: data.message });
            }
        } catch (error) {
            console.error(error);
            showToast({
                type: 'error',
                message: 'Error de red',
                description: 'No se pudo procesar la solicitud. Verifica tu conexión.',
            });
        } finally {
            setIsDeleting(false);
            setDeletingCompany(null);
        }
    };

    const filteredData = useMemo(() => {
        let result = companies;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (company) =>
                    company.name.toLowerCase().includes(query) ||
                    company.rut.toLowerCase().includes(query) ||
                    (company.alias && company.alias.toLowerCase().includes(query))
            );
        }

        if (filterActive !== 'all') {
            result = result.filter((company) => company.active === (filterActive === 1));
        }

        return result;
    }, [companies, searchQuery]);

    if (!isSuperAdmin) {
        return <Redirect href="/(tabs)" />;
    }

    const renderItem = ({ item }: { item: Company }) => (
        <ItemCard
            title={item.name}
            icon={<Building size={20} color="#047857" />}
            badges={[
                { label: item.active ? 'Activa' : 'Inactiva', variant: item.active ? 'active' : 'inactive' },
                { label: item.alias, variant: 'default' }
            ]}
            details={[
                { label: 'Razón Social', value: item.razon_social },
                { label: 'RUT', value: item.rut },
                { label: 'Dirección', value: item.direccion },
                ...(item.contacts && item.contacts.length > 0 ? [{ label: 'Contactos Asociados', value: item.contacts.length.toString() }] : []),
            ]}
            style={numColumns > 1 ? { flex: 1, marginHorizontal: 6, maxWidth: `${100 / numColumns}%` } : {}}
            onPress={() => router.push(`/(admin)/company/${item.id}` as any)}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Directorio de Empresas</Text>
                <Text style={styles.subtitle}>Gestona las empresas asociadas al sistema.</Text>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar por nombre, RUT o alias..."
                showFilter={true}
                onFilterPress={() => setShowFilterModal(true)}
            />

            {/* Filer Modal */}
            <AdaptiveModal
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                title="Filtros de Búsqueda"
            >
                <View style={styles.filterForm}>
                    <Text style={styles.filterLabel}>Estado</Text>
                    <SelectDropdown
                        options={[
                            { label: 'Todos', value: 'all' },
                            { label: 'Activas', value: 1 },
                            // { label: 'Inactivas', value: 0 }, // Future inactive support
                        ]}
                        selectedValue={filterActive}
                        onSelect={setFilterActive}
                        placeholder="Filtrar por estado..."
                    />
                </View>
            </AdaptiveModal>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#059669" />
                </View>
            ) : (
                <FlatList
                    key={numColumns} // Force re-render flatlist on column change
                    data={filteredData}
                    numColumns={numColumns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay empresas para mostrar.</Text>
                        </View>
                    }
                />
            )}

            <AdaptiveModal
                visible={!!editingCompany}
                onClose={() => setEditingCompany(null)}
                title="Editar Empresa"
            >
                {editingCompany && (
                    <EditCompanyForm
                        company={editingCompany}
                        onSuccess={() => {
                            setEditingCompany(null);
                            fetchData();
                        }}
                    />
                )}
            </AdaptiveModal>

            <ConfirmationModal
                visible={!!deletingCompany}
                title="Eliminar Empresa"
                description={`¿Estás seguro de que deseas eliminar la empresa ${deletingCompany?.name}? ADVERTENCIA: Se eliminarán también todos los contactos asociados.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeletingCompany(null)}
                isDestructive={true}
                isLoading={isDeleting}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        maxWidth: 1024,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#64748b',
        marginTop: 4,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: TAB_BAR_HEIGHT + 20,
    },
    filterForm: {
        paddingVertical: 10,
        gap: 8,
    },
    filterLabel: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#475569',
        marginBottom: 4,
    },
    columnWrapper: {
        justifyContent: 'flex-start',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#64748b',
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
});
