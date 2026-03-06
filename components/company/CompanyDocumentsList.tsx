import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { FileText, DownloadCloud } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

interface CompanyDocument {
    company_document_id: number;
    file_key: string;
    document_id: number;
    file_name: string;
    document_type: string;
    signedUrl: string | null;
}

interface CompanyDocumentsListProps {
    companyId: number;
}

export const CompanyDocumentsList = ({ companyId }: CompanyDocumentsListProps) => {
    const { token } = useAuth();
    const [documents, setDocuments] = useState<CompanyDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, [companyId]);

    const fetchDocuments = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}/${companyId}/documents`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setDocuments(data.data);
            } else {
                setError(data.message || 'Error al obtener documentos');
            }
        } catch (err) {
            console.error(err);
            setError('Error de red al obtener documentos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDocument = (url: string | null) => {
        if (url) {
            Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
        }
    };

    const renderDocument = ({ item }: { item: CompanyDocument }) => (
        <View style={styles.documentCard}>
            <View style={styles.docIconWrapper}>
                <FileText size={24} color="#3b82f6" />
            </View>
            <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={1}>{item.file_name}</Text>
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.document_type || 'General'}</Text>
                    </View>
                </View>
            </View>
            {item.signedUrl && (
                <Pressable
                    style={({ pressed }) => [
                        styles.downloadBtn,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => handleOpenDocument(item.signedUrl)}
                >
                    <DownloadCloud size={20} color="#059669" />
                </Pressable>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.statusText}>Cargando documentos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={fetchDocuments} style={styles.retryBtn}>
                    <Text style={styles.retryBtnText}>Reintentar</Text>
                </Pressable>
            </View>
        );
    }

    if (documents.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <FileText size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>No hay documentos disponibles para esta empresa.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={documents}
            keyExtractor={(item) => item.company_document_id.toString()}
            renderItem={renderDocument}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        marginTop: 12,
        color: '#64748b',
        fontFamily: 'Inter-Medium',
    },
    errorText: {
        color: '#ef4444',
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyText: {
        color: '#64748b',
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
    },
    retryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    retryBtnText: {
        color: '#2563eb',
        fontFamily: 'Inter-SemiBold',
    },
    listContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 12,
    },
    documentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    docIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    docInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    docName: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: '#1e293b',
        marginBottom: 6,
    },
    badgeContainer: {
        flexDirection: 'row',
    },
    badge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: '#475569',
    },
    downloadBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
});
