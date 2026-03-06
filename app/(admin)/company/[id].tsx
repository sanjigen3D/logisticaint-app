import { EditCompanyForm } from '@/components/forms/admin/EditCompanyForm';
import { EditUserForm } from '@/components/forms/admin/EditUserForm';
import AdaptiveModal from '@/components/UI/AdaptiveModal';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import ItemCard from '@/components/UI/ItemCard';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company } from '@/lib/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Building, Edit, FileText, Settings, Trash2, UploadCloud, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
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

export default function CompanyDashboardScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token, user: authUser, canEditUser, isSuperAdmin: checkSuperAdmin } = useAuth();
    const isSuperAdmin = checkSuperAdmin();
    const router = useRouter();
    const { showToast } = useToastStore();
    const queryClient = useQueryClient();

    const { data: dashboardData, isLoading, refetch } = useQuery({
        queryKey: ['companyDashboard', id],
        queryFn: async () => {

            // DASHBOARD BOUNDARY PROTECTION RULE:
            if (!isSuperAdmin && authUser?.company_id && id !== authUser.company_id.toString()) {
                showToast({ type: 'error', message: 'Acceso Restringido', description: 'No puedes visualizar empresas ajenas.' });
                router.replace('/(tabs)');
                throw new Error('Access Denied');
            }

            const [companyRes, usersRes] = await Promise.all([
                fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${ROUTES.API_ROUTE}${ROUTES.API_USERS}/company/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const companyData = await companyRes.json();
            const usersData = await usersRes.json();

            if (!companyData.success) {
                throw new Error('Empresa no encontrada');
            }

            return {
                company: companyData.data as Company,
                users: usersData.success
                    ? (Array.isArray(usersData.data) ? usersData.data : [usersData.data]) as UserItem[]
                    : []
            };
        },
        enabled: !!id && !!token,
        staleTime: 1000 * 60 * 3, // Cache stays fresh for 3 minutes
    });

    const company = dashboardData?.company || null;
    const users = dashboardData?.users || [];

    // Modals state
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(false);
    const [deletingCompany, setDeletingCompany] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // User Modals state
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
    const [isDeletingUser, setIsDeletingUser] = useState(false);

    const { width } = useWindowDimensions();

    const getNumColumns = () => {
        if (width >= 1024) return 3;
        if (width >= 768) return 2;
        return 1;
    };

    const numColumns = getNumColumns();

    const confirmDelete = async () => {
        if (!company) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}/${company.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                showToast({
                    type: 'success',
                    message: 'Empresa eliminada',
                    description: 'La empresa y sus contactos se han eliminado correctamente.',
                });
                router.back();
            } else {
                showToast({ type: 'error', message: 'Error', description: data.message });
            }
        } catch (error) {
            showToast({ type: 'error', message: 'Error', description: 'No se pudo eliminar la empresa.' });
        } finally {
            setIsDeleting(false);
            setDeletingCompany(false);
        }
    };

    const confirmDeleteUser = async () => {
        if (!deletingUser) return;
        setIsDeletingUser(true);
        try {
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_USERS}/${deletingUser.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                showToast({ type: 'success', message: 'Usuario eliminado', description: 'El usuario se ha desactivado correctamente.' });
                refetch();
            } else {
                showToast({ type: 'error', message: 'Error', description: data.message });
            }
        } catch (error) {
            showToast({ type: 'error', message: 'Error', description: 'No se pudo eliminar el usuario.' });
        } finally {
            setIsDeletingUser(false);
            setDeletingUser(null);
        }
    };

    const renderUser = ({ item }: { item: UserItem }) => {
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
                        onPress: () => {
                            setEditingUser(item);
                            setShowOptionsModal(false);
                        },
                        variant: 'primary'
                    },
                    {
                        label: 'Eliminar',
                        icon: <Trash2 size={16} color="#ef4444" />,
                        onPress: () => {
                            setDeletingUser(item);
                            setShowOptionsModal(false);
                        },
                        variant: 'destructive'
                    }
                ] : []}
                details={[
                    { label: 'Email', value: item.email },
                    { label: 'Rol', value: item.type },
                ]}
                style={numColumns > 1 ? { flex: 1, marginHorizontal: 6, maxWidth: `${100 / numColumns}%` } : {}}
            />
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#059669" />
            </View>
        );
    }

    if (!company) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Empresa no encontrada.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: company.name || 'Empresa' }} />

            <View style={styles.companySummaryCard}>
                <View style={styles.summaryHeader}>
                    <View style={styles.summaryTitleRow}>
                        <Building size={24} color="#047857" style={{ marginRight: 12 }} />
                        <Text style={styles.companyName}>{company.name}</Text>
                    </View>
                    <View style={styles.summaryActionsRow}>
                        <View style={[styles.badge, company.active ? styles.badgeActive : styles.badgeInactive]}>
                            <Text style={[styles.badgeText, company.active ? styles.badgeTextActive : styles.badgeTextInactive]}>
                                {company.active ? 'Activa' : 'Inactiva'}
                            </Text>
                        </View>
                        {authUser?.type === 'Admin' && (
                            <Pressable
                                onPress={() => setShowOptionsModal(true)}
                                style={({ pressed }) => [
                                    styles.settingsBtn,
                                    pressed && { opacity: 0.7 }
                                ]}
                            >
                                <Settings size={22} color="#475569" />
                            </Pressable>
                        )}
                    </View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.companyDetail}>RUT: {company.rut}</Text>
                <Text style={styles.companyDetail}>Dirección: {company.direccion}</Text>
            </View>

            {/* Documentos Section (Visible for ALL) */}
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Documentos</Text>
                <Text style={styles.listSubtitle}>Gestiona los documentos asociados</Text>
            </View>
            <View style={styles.documentsContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.docButton,
                        pressed && { opacity: 0.8 }
                    ]}
                    onPress={() => showToast({ type: 'info', message: 'Próximamente', description: 'Esta función estará disponible muy pronto.' })}
                >
                    <UploadCloud size={24} color="#059669" />
                    <Text style={styles.docButtonText}>Subir Documento</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.docButton,
                        styles.docButtonView,
                        pressed && { opacity: 0.8 }
                    ]}
                    onPress={() => showToast({ type: 'info', message: 'Próximamente', description: 'Esta función estará disponible muy pronto.' })}
                >
                    <FileText size={24} color="#3b82f6" />
                    <Text style={[styles.docButtonText, { color: '#2563eb' }]}>Ver Documentos</Text>
                </Pressable>
            </View>

            {/* Users section (Hidden for 'User' types) */}
            {authUser?.type !== 'User' && (
                <>
                    <View style={[styles.listHeader, { marginTop: 24 }]}>
                        <Text style={styles.listTitle}>Usuarios de la empresa</Text>
                        <Text style={styles.listSubtitle}>{users.length} usuarios registrados</Text>
                    </View>

                    <FlatList
                        key={numColumns}
                        data={users}
                        numColumns={numColumns}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderUser}
                        contentContainerStyle={styles.listContent}
                        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No hay usuarios asociados a esta empresa.</Text>
                            </View>
                        }
                    />
                </>
            )}

            {/* Options Modal */}
            <AdaptiveModal
                visible={showOptionsModal}
                onClose={() => setShowOptionsModal(false)}
                title="Opciones de Empresa"
            >
                <View style={styles.optionsList}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.optionItem,
                            pressed && { backgroundColor: '#f8fafc' }
                        ]}
                        onPress={() => {
                            setShowOptionsModal(false);
                            setTimeout(() => setEditingCompany(true), 300);
                        }}
                    >
                        <View style={[styles.optionIcon, { backgroundColor: '#ecfdf5' }]}>
                            <Edit size={20} color="#059669" />
                        </View>
                        <Text style={styles.optionText}>Editar Información</Text>
                    </Pressable>

                    {isSuperAdmin && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.optionItem,
                                pressed && { backgroundColor: '#f8fafc' }
                            ]}
                            onPress={() => {
                                setShowOptionsModal(false);
                                setTimeout(() => setDeletingCompany(true), 300);
                            }}
                        >
                            <View style={[styles.optionIcon, { backgroundColor: '#fef2f2' }]}>
                                <Trash2 size={20} color="#ef4444" />
                            </View>
                            <Text style={[styles.optionText, { color: '#ef4444' }]}>Eliminar Empresa</Text>
                        </Pressable>
                    )}
                </View>
            </AdaptiveModal>

            {/* Edit Modal */}
            <AdaptiveModal
                visible={editingCompany}
                onClose={() => setEditingCompany(false)}
                title="Editar Empresa"
            >
                <EditCompanyForm
                    company={company}
                    onSuccess={() => {
                        setEditingCompany(false);
                        refetch();
                        queryClient.invalidateQueries({ queryKey: ['companies'] }); // Invalidate global lists if needed
                    }}
                />
            </AdaptiveModal>

            {/* Delete Modal */}
            <ConfirmationModal
                visible={deletingCompany}
                title="Eliminar Empresa"
                description={`¿Estás seguro de que deseas eliminar la empresa ${company?.name}? ADVERTENCIA: Se eliminarán también todos los contactos asociados.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeletingCompany(false)}
                isDestructive={true}
                isLoading={isDeleting}
            />

            {/* Edit User Modal */}
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
                            refetch();
                        }}
                    />
                )}
            </AdaptiveModal>

            {/* Delete User Modal */}
            <ConfirmationModal
                visible={!!deletingUser}
                title="Eliminar Usuario"
                description={`¿Estás seguro de que deseas eliminar a ${deletingUser?.name}?`}
                onConfirm={confirmDeleteUser}
                onCancel={() => setDeletingUser(null)}
                isDestructive={true}
                isLoading={isDeletingUser}
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
        paddingTop: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBtn: {
        padding: 8,
        marginRight: Platform.OS === 'ios' ? -8 : 8,
    },
    companySummaryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    companyName: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: '#0f172a',
        flexShrink: 1,
    },
    summaryActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingsBtn: {
        padding: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeActive: {
        backgroundColor: '#dcfce7',
    },
    badgeInactive: {
        backgroundColor: '#fee2e2',
    },
    badgeText: {
        fontSize: 12,
        fontFamily: 'Inter-SemiBold',
    },
    badgeTextActive: {
        color: '#166534',
    },
    badgeTextInactive: {
        color: '#991b1b',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
    },
    companyDetail: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        color: '#475569',
        marginBottom: 8,
    },
    listHeader: {
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: '#0f172a',
    },
    listSubtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#64748b',
        marginTop: 4,
    },
    listContent: {
        paddingBottom: TAB_BAR_HEIGHT + 20,
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
        textAlign: 'center',
    },
    optionsList: {
        gap: 8,
        paddingVertical: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 16,
    },
    optionIcon: {
        padding: 10,
        borderRadius: 10,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: '#0f172a',
    },
    documentsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    docButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#ecfdf5',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d1fae5',
    },
    docButtonView: {
        backgroundColor: '#eff6ff',
        borderColor: '#dbeafe',
    },
    docButtonText: {
        fontSize: 15,
        fontFamily: 'Inter-SemiBold',
        color: '#059669',
    },
});
