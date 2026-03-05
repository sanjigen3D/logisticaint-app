import { EditUserForm } from '@/components/forms/admin/EditUserForm';
import AdaptiveModal from '@/components/UI/AdaptiveModal';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import ItemCard from '@/components/UI/ItemCard';
import SearchBar from '@/components/UI/SearchBar';
import { SelectDropdown } from '@/components/UI/SelectDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company } from '@/lib/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { Edit, Trash2, User } from 'lucide-react-native';
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

type UserItem = {
    id: number;
    name: string;
    email: string;
    type: string;
    active: boolean;
    company_id: number;
    company_name: string;
};

export default function UsersScreen() {
    const { isManagerOrHigher, user, token, canEditUser, isSuperAdmin: checkSuperAdmin } = useAuth();
    const isSuperAdmin = checkSuperAdmin();
    const { showToast } = useToastStore();
    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
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

    const { data: queryData, isLoading: loading, refetch: fetchUsers } = useQuery({
        queryKey: ['usersList', isSuperAdmin, user?.company_id],
        queryFn: async () => {
            if (!isManagerOrHigher()) throw new Error('Acceso restringido');

            const endpoint = isSuperAdmin
                ? `${ROUTES.API_ROUTE}${ROUTES.API_USERS}`
                : `${ROUTES.API_ROUTE}${ROUTES.API_USERS}/company/${user?.company_id}`;

            const [usersRes, compRes] = await Promise.all([
                fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } }),
                isSuperAdmin
                    ? fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}`, { headers: { Authorization: `Bearer ${token}` } })
                    : Promise.resolve(null)
            ]);

            const usersData = await usersRes.json();
            let companiesData = { success: false, data: [] };

            if (compRes) {
                companiesData = await compRes.json();
            }

            if (!usersData.success) {
                showToast({ type: 'error', message: 'Error', description: usersData.message || 'Error al cargar usuarios.' });
                throw new Error(usersData.message);
            }

            return {
                users: (Array.isArray(usersData.data) ? usersData.data : [usersData.data]) as UserItem[],
                companies: (companiesData.success ? companiesData.data : []) as Company[]
            };
        },
        enabled: !!token && isManagerOrHigher(),
        staleTime: 1000 * 60 * 1.5, // 1.5 minutes cache
    });

    const users = queryData?.users || [];
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
        if (!deletingUser) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_USERS}/${deletingUser.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                showToast({
                    type: 'success',
                    message: 'Usuario eliminado',
                    description: 'El usuario se ha desactivado correctamente.',
                });
                fetchUsers();
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
                description: 'No se pudo eliminar el usuario.',
            });
        } finally {
            setIsDeleting(false);
            setDeletingUser(null);
        }
    };

    if (!isManagerOrHigher()) {
        return <Redirect href="/(tabs)" />;
    }

    const filteredData = useMemo(() => {
        let result = users;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(query) ||
                    u.email.toLowerCase().includes(query) ||
                    (u.type && u.type.toLowerCase().includes(query))
            );
        }

        if (filterActive !== 'all') {
            result = result.filter((u) => u.active === (filterActive === 1));
        }

        if (filterCompanyId !== 'all') {
            result = result.filter((u) => u.company_id === filterCompanyId);
        }

        return result;
    }, [users, searchQuery]);

    const renderItem = ({ item }: { item: UserItem }) => {
        const canEdit = canEditUser({ id: item.id, type: item.type, company_name: item.company_name });

        return (
            <ItemCard
                title={item.name}
                icon={<User size={20} color="#3b82f6" />}
                badges={[
                    { label: item.active ? 'Activo' : 'Inactivo', variant: item.active ? 'active' : 'inactive' }
                ]}
                actions={canEdit ? [
                    {
                        label: 'Editar',
                        icon: <Edit size={16} color="#3b82f6" />,
                        onPress: () => setEditingUser(item),
                        variant: 'primary'
                    },
                    {
                        label: 'Eliminar',
                        icon: <Trash2 size={16} color="#ef4444" />,
                        onPress: () => setDeletingUser(item),
                        variant: 'destructive'
                    }
                ] : []}
                details={[
                    { label: 'Email', value: item.email },
                    { label: 'Rol', value: item.type },
                    ...(isSuperAdmin ? [{ label: 'Empresa', value: item.company_name }] : []),
                ]}
                style={numColumns > 1 ? { flex: 1, marginHorizontal: 6, maxWidth: `${100 / numColumns}%` } : {}}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Directorio de Usuarios</Text>
                <Text style={styles.subtitle}>Gestona los usuarios de las plataformas.</Text>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar por nombre, email o rol..."
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
                    <ActivityIndicator size="large" color="#3b82f6" />
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
                            <Text style={styles.emptyText}>No hay usuarios para mostrar.</Text>
                        </View>
                    }
                />
            )}

            <AdaptiveModal
                visible={!!editingUser}
                onClose={() => setEditingUser(null)}
                title="Editar Usuario"
            >
                {editingUser && (
                    <EditUserForm
                        userItem={editingUser}
                        onSuccess={() => {
                            setEditingUser(null);
                            fetchUsers();
                        }}
                    />
                )}
            </AdaptiveModal>

            <ConfirmationModal
                visible={!!deletingUser}
                title="Eliminar Usuario"
                description={`¿Estás seguro de que deseas eliminar a ${deletingUser?.name}?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeletingUser(null)}
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
