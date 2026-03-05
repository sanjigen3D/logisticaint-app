import { EditContactForm } from '@/components/forms/admin/EditContactForm';
import AdaptiveModal from '@/components/UI/AdaptiveModal';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import ItemCard from '@/components/UI/ItemCard';
import SearchBar from '@/components/UI/SearchBar';
import { SelectDropdown } from '@/components/UI/SelectDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company, Contact } from '@/lib/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { Contact2, Edit, Trash2 } from 'lucide-react-native';
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

export default function ContactsScreen() {
    const { isManagerOrHigher, user, token, isSuperAdmin: checkSuperAdmin } = useAuth();
    const isSuperAdmin = checkSuperAdmin();
    const { showToast } = useToastStore();
    const queryClient = useQueryClient();
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { width } = useWindowDimensions();

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterActive, setFilterActive] = useState<string | number>('all');
    const [filterCompanyId, setFilterCompanyId] = useState<string | number>('all');

    const getNumColumns = () => {
        if (width >= 1024) return 3;
        if (width >= 768) return 2;
        return 1;
    };

    const numColumns = getNumColumns();

    const { data: queryData, isLoading: loading, refetch: fetchContacts } = useQuery({
        queryKey: ['contactsList', isSuperAdmin, user?.company_id],
        queryFn: async () => {
            if (!isManagerOrHigher()) throw new Error('Acceso restringido');

            const endpoint = isSuperAdmin
                ? `${ROUTES.API_ROUTE}${ROUTES.API_CONTACTS}`
                : `${ROUTES.API_ROUTE}${ROUTES.API_CONTACTS}/company/${user?.company_id}`;

            const [contactsRes, compRes] = await Promise.all([
                fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } }),
                isSuperAdmin
                    ? fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}`, { headers: { Authorization: `Bearer ${token}` } })
                    : Promise.resolve(null)
            ]);

            const contactsData = await contactsRes.json();
            let companiesData = { success: false, data: [] };

            if (compRes) {
                companiesData = await compRes.json();
            }

            if (!contactsData.success) {
                showToast({ type: 'error', message: 'Error', description: contactsData.message || 'Error al cargar contactos.' });
                throw new Error(contactsData.message);
            }

            let finalContacts = Array.isArray(contactsData.data) ? contactsData.data : [contactsData.data];

            if (!isSuperAdmin) {
                finalContacts = finalContacts.filter((c: Contact) => c.company_id === user?.company_id);
            }

            return {
                contacts: finalContacts as Contact[],
                companies: (companiesData.success ? companiesData.data : []) as Company[]
            };
        },
        enabled: !!token && isManagerOrHigher(),
        staleTime: 1000 * 60 * 2, // 2 minutes cache
    });

    const contacts = queryData?.contacts || [];
    const companiesList = queryData?.companies || [];

    useEffect(() => {
        if (!isManagerOrHigher()) {
            showToast({
                type: 'error',
                message: 'Acceso restringido',
                description: 'No tienes permisos para acceder a esta sección.',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const confirmDelete = async () => {
        if (!deletingContact) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_CONTACTS}/${deletingContact.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                showToast({
                    type: 'success',
                    message: 'Contacto eliminado',
                    description: 'El contacto se ha eliminado correctamente.',
                });
                fetchContacts();
            } else {
                showToast({
                    type: 'error',
                    message: 'Error',
                    description: data.message,
                });
            }
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Error',
                description: 'No se pudo eliminar el contacto.',
            });
        } finally {
            setIsDeleting(false);
            setDeletingContact(null);
        }
    };

    if (!isManagerOrHigher()) {
        return <Redirect href="/(tabs)" />;
    }

    const filteredData = useMemo(() => {
        let result = contacts;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(query) ||
                    contact.email.toLowerCase().includes(query) ||
                    (contact.phone && contact.phone.toLowerCase().includes(query))
            );
        }

        if (filterActive !== 'all') {
            result = result.filter((contact) => contact.active === (filterActive === 1));
        }

        if (filterCompanyId !== 'all') {
            result = result.filter((contact) => contact.company_id === filterCompanyId);
        }

        return result;
    }, [contacts, searchQuery]);

    const renderItem = ({ item }: { item: Contact }) => (
        <ItemCard
            title={item.name}
            icon={<Contact2 size={20} color="#0284c7" />}
            badges={[
                { label: item.active ? 'Activo' : 'Inactivo', variant: item.active ? 'active' : 'inactive' }
            ]}
            actions={[
                {
                    label: 'Editar',
                    icon: <Edit size={16} color="#0284c7" />,
                    onPress: () => setEditingContact(item),
                    variant: 'primary'
                },
                {
                    label: 'Eliminar',
                    icon: <Trash2 size={16} color="#ef4444" />,
                    onPress: () => setDeletingContact(item),
                    variant: 'destructive'
                }
            ]}
            details={[
                { label: 'Email', value: item.email },
                { label: 'Teléfono', value: item.phone },
                ...(isSuperAdmin ? [{ label: 'Empresa ID', value: item.company_id.toString() }] : []),
            ]}
            style={numColumns > 1 ? { flex: 1, marginHorizontal: 6, maxWidth: `${100 / numColumns}%` } : {}}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Directorio de Contactos</Text>
                <Text style={styles.subtitle}>Gestiona los contactos de las empresas.</Text>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar por nombre, email o teléfono..."
                showFilter={true}
                onFilterPress={() => setShowFilterModal(true)}
            />

            {/* Filter Modal */}
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
                            { label: 'Activos', value: 1 },
                            // { label: 'Inactivos', value: 0 },
                        ]}
                        selectedValue={filterActive}
                        onSelect={setFilterActive}
                        placeholder="Filtrar por estado..."
                    />

                    {isSuperAdmin && (
                        <>
                            <Text style={[styles.filterLabel, { marginTop: 12 }]}>Empresa</Text>
                            <SelectDropdown
                                options={[
                                    { label: 'Todas las empresas', value: 'all' },
                                    ...companiesList.map(c => ({ label: c.name, value: c.id }))
                                ]}
                                selectedValue={filterCompanyId}
                                onSelect={setFilterCompanyId}
                                placeholder="Filtrar por empresa..."
                            />
                        </>
                    )}
                </View>
            </AdaptiveModal>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0284c7" />
                </View>
            ) : (
                <FlatList
                    key={numColumns}
                    data={filteredData}
                    numColumns={numColumns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay contactos para mostrar.</Text>
                        </View>
                    }
                />
            )}

            <AdaptiveModal
                visible={!!editingContact}
                onClose={() => setEditingContact(null)}
                title="Editar Contacto"
            >
                {editingContact && (
                    <EditContactForm
                        contact={editingContact}
                        onSuccess={() => {
                            setEditingContact(null);
                            fetchContacts();
                        }}
                    />
                )}
            </AdaptiveModal>

            <ConfirmationModal
                visible={!!deletingContact}
                title="Eliminar Contacto"
                description={`¿Estás seguro de que deseas eliminar a ${deletingContact?.name}?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeletingContact(null)}
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
