import { EditUserForm } from '@/components/forms/admin/EditUserForm';
import AdaptiveModal from '@/components/UI/AdaptiveModal';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Redirect } from 'expo-router';
import { Edit, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
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
    const { isManagerOrHigher, user, token } = useAuth();
    const { showToast } = useToastStore();
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const isSuperAdmin = user?.company_name?.toLowerCase().includes('sanjigen');

    useEffect(() => {
        if (!isManagerOrHigher()) {
            showToast({
                type: 'error',
                message: 'Acceso restringido',
                description: 'No tienes permisos para acceder a esta sección.',
            });
        } else {
            fetchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const endpoint = isSuperAdmin
                ? `${ROUTES.API_ROUTE}${ROUTES.API_USERS}`
                : `${ROUTES.API_ROUTE}${ROUTES.API_USERS}/company/${user?.company_id}`;

            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setUsers(Array.isArray(data.data) ? data.data : [data.data]);
            } else {
                showToast({
                    type: 'error',
                    message: 'Error',
                    description: data.message || 'No se pudieron cargar los usuarios.',
                });
            }
        } catch (error) {
            console.error(error);
            showToast({
                type: 'error',
                message: 'Error de red',
                description: 'No se pudo conectar con el servidor.',
            });
        } finally {
            setLoading(false);
        }
    };

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

    const renderItem = ({ item }: { item: UserItem }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={[styles.badge, item.active ? styles.badgeActive : styles.badgeInactive]}>
                    <Text style={[styles.badgeText, item.active ? styles.badgeTextActive : styles.badgeTextInactive]}>
                        {item.active ? 'Activo' : 'Inactivo'}
                    </Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.detail}>Email: {item.email}</Text>
                <Text style={styles.detail}>Rol: {item.type}</Text>
                {isSuperAdmin && <Text style={styles.detail}>Empresa: {item.company_name}</Text>}
            </View>
            <View style={styles.cardFooter}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => setEditingUser(item)}
                >
                    <Edit size={16} color="#3b82f6" />
                    <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => setDeletingUser(item)}
                >
                    <Trash2 size={16} color="#ef4444" />
                    <Text style={styles.deleteBtnText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Usuarios</Text>
                <Text style={styles.subtitle}>
                    {isSuperAdmin ? 'Gestiona todos los usuarios del sistema' : 'Gestiona los usuarios de tu empresa'}
                </Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
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
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#0f172a',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeActive: {
        backgroundColor: '#dcfce7',
    },
    badgeInactive: {
        backgroundColor: '#fee2e2',
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'Inter-Medium',
    },
    badgeTextActive: {
        color: '#166534',
    },
    badgeTextInactive: {
        color: '#991b1b',
    },
    cardBody: {
        marginBottom: 16,
    },
    detail: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#475569',
        marginBottom: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    editBtn: {
        backgroundColor: '#eff6ff',
    },
    editBtnText: {
        color: '#3b82f6',
        fontSize: 13,
        fontFamily: 'Inter-Medium',
    },
    deleteBtn: {
        backgroundColor: '#fef2f2',
    },
    deleteBtnText: {
        color: '#ef4444',
        fontSize: 13,
        fontFamily: 'Inter-Medium',
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
