import { EditContactForm } from '@/components/forms/admin/EditContactForm';
import AdaptiveModal from '@/components/UI/AdaptiveModal';
import { ConfirmationModal } from '@/components/UI/ConfirmationModal';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Contact } from '@/lib/types/types';
import { Redirect } from 'expo-router';
import { Contact2, Edit, Trash2 } from 'lucide-react-native';
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

export default function ContactsScreen() {
    const { isManagerOrHigher, user, token } = useAuth();
    const { showToast } = useToastStore();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
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
            fetchContacts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_CONTACTS}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                const allContacts = Array.isArray(data.data) ? data.data : [data.data];

                // Filter contacts if not superadmin
                if (!isSuperAdmin) {
                    const filtered = allContacts.filter(
                        (contact: Contact) => contact.company_id === user?.company_id
                    );
                    setContacts(filtered);
                } else {
                    setContacts(allContacts);
                }
            } else {
                showToast({
                    type: 'error',
                    message: 'Error',
                    description: data.message || 'No se pudieron cargar los contactos.',
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

    const renderItem = ({ item }: { item: Contact }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    <Contact2 size={20} color="#0284c7" style={{ marginRight: 8 }} />
                    <Text style={styles.name}>{item.name}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.detail}>Email: {item.email}</Text>
                <Text style={styles.detail}>Teléfono: {item.phone}</Text>
                {isSuperAdmin && (
                    <Text style={styles.detailCompanyId}>Empresa ID: {item.company_id}</Text>
                )}
            </View>
            <View style={styles.cardFooter}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => setEditingContact(item)}
                >
                    <Edit size={16} color="#0284c7" />
                    <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => setDeletingContact(item)}
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
                <Text style={styles.title}>Contactos</Text>
                <Text style={styles.subtitle}>
                    {isSuperAdmin
                        ? 'Gestión global de contactos de todas las empresas'
                        : 'Gestiona los contactos de tu empresa'}
                </Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0284c7" />
                </View>
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
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
    cardBody: {
        marginBottom: 16,
    },
    detail: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#475569',
        marginBottom: 4,
    },
    detailCompanyId: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: '#0284c7',
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
        backgroundColor: '#e0f2fe',
    },
    editBtnText: {
        color: '#0284c7',
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
