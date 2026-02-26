import { EditCompanyForm } from '@/components/forms/admin/EditCompanyForm';
import AdaptiveModal from '@/components/UI/AdaptiveModal';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company } from '@/lib/types/types';
import { Redirect } from 'expo-router';
import { Building, Edit, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export default function CompaniesScreen() {
    const { isManagerOrHigher, user, token } = useAuth();
    const { showToast } = useToastStore();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const isSuperAdmin = user?.company_name?.toLowerCase().includes('sanjigen');

    useEffect(() => {
        if (!isSuperAdmin) {
            showToast({
                type: 'error',
                message: 'Acceso restringido',
                description: 'Solo los administradores globales pueden ver todas las empresas.',
            });
        } else {
            fetchCompanies();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setCompanies(Array.isArray(data.data) ? data.data : [data.data]);
            } else {
                showToast({
                    type: 'error',
                    message: 'Error',
                    description: data.message || 'No se pudieron cargar las empresas.',
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
                    description: 'La empresa y sus contactos se han eliminado correctamente.',
                });
                fetchCompanies();
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
                description: 'No se pudo eliminar la empresa.',
            });
        } finally {
            setIsDeleting(false);
            setDeletingCompany(null);
        }
    };

    if (!isSuperAdmin) {
        return <Redirect href="/(tabs)" />;
    }

    const renderItem = ({ item }: { item: Company }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    <Building size={20} color="#047857" style={{ marginRight: 8 }} />
                    <Text style={styles.name}>{item.name}</Text>
                </View>
                <View style={styles.badgeRow}>
                    <View style={[styles.statusBadge, item.active ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                        <Text style={[styles.statusBadgeText, item.active ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
                            {item.active ? 'Activa' : 'Inactiva'}
                        </Text>
                    </View>
                    <View style={styles.aliasBadge}>
                        <Text style={styles.aliasBadgeText}>{item.alias}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.detail}>Razón Social: {item.razon_social}</Text>
                <Text style={styles.detail}>RUT: {item.rut}</Text>
                <Text style={styles.detail}>Dirección: {item.direccion}</Text>
                {item.contacts && item.contacts.length > 0 && (
                    <Text style={styles.detailContactCount}>
                        Contactos asociados: {item.contacts.length}
                    </Text>
                )}
            </View>
            <View style={styles.cardFooter}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionBtn,
                        styles.editBtn,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setEditingCompany(item)}
                >
                    <Edit size={16} color="#059669" />
                    <Text style={styles.editBtnText}>Editar</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.actionBtn,
                        styles.deleteBtn,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setDeletingCompany(item)}
                >
                    <Trash2 size={16} color="#ef4444" />
                    <Text style={styles.deleteBtnText}>Eliminar</Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Empresas</Text>
                <Text style={styles.subtitle}>Gestión global de empresas y clientes</Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#059669" />
                </View>
            ) : (
                <FlatList
                    data={companies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
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
                            fetchCompanies();
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#0f172a',
    },
    badge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'Inter-Medium',
        color: '#475569',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeActive: {
        backgroundColor: '#dcfce7',
    },
    statusBadgeInactive: {
        backgroundColor: '#fee2e2',
    },
    statusBadgeText: {
        fontSize: 11,
        fontFamily: 'Inter-Medium',
    },
    statusBadgeTextActive: {
        color: '#166534',
    },
    statusBadgeTextInactive: {
        color: '#991b1b',
    },
    aliasBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    aliasBadgeText: {
        fontSize: 11,
        fontFamily: 'Inter-Medium',
        color: '#475569',
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
    detailContactCount: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: '#047857',
        marginTop: 8,
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
        backgroundColor: '#ecfdf5',
    },
    editBtnText: {
        color: '#059669',
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
