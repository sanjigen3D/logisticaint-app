import { SelectDropdown } from '@/components/UI/SelectDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { ROUTES } from '@/lib/Routes';
import { storage } from '@/lib/storage';
import { useToastStore } from '@/lib/stores/useToastStore';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, Link as LinkIcon, UploadCloud } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface DocumentType {
    id: number;
    type: string;
}

interface DocumentUploadFormProps {
    companyId: number;
    onSuccess: () => void;
}

export const DocumentUploadForm = ({ companyId, onSuccess }: DocumentUploadFormProps) => {
    const { token } = useAuth();
    const { showToast } = useToastStore();

    const [types, setTypes] = useState<DocumentType[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [fileName, setFileName] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        if (!token) return;
        setLoadingTypes(true);
        try {
            // Check Cache first (1 hora)
            const CACHE_KEY = '@document_types_cache';
            const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

            const cachedStr = await storage.getItem(CACHE_KEY);
            if (cachedStr) {
                const parsed = JSON.parse(cachedStr);
                if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
                    setTypes(parsed.data);
                    setLoadingTypes(false);
                    return; // Retornar si la cache sigue válida
                }
            }

            const response = await fetch(`${ROUTES.API_ROUTE}/documents/types`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setTypes(data.data);

                // Guardarlo en cache asincrónico para futuras consultas
                await storage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: data.data
                }));
            } else {
                console.error("Endpoint returned false success:", data.message);
            }
        } catch (error) {
            console.error("Error fetching doc types:", error);
        } finally {
            setLoadingTypes(false);
        }
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'image/*',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setSelectedFile(asset);
                setFileName(asset.name);
            }
        } catch (error) {
            console.error("Error picking document:", error);
            showToast({ type: 'error', message: 'Error', description: 'No se pudo seleccionar el archivo.' });
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !fileName || !selectedTypeId || !token) {
            showToast({ type: 'error', message: 'Faltan datos', description: 'Selecciona un archivo, asigna un nombre y un tipo.' });
            return;
        }

        setIsUploading(true);

        try {
            // 1. Get Signed URL from our backend
            const contentType = selectedFile.mimeType || 'application/octet-stream';

            const permissionRes = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}/${companyId}/documents/upload-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileName,
                    contentType,
                    typeId: selectedTypeId
                })
            });

            const permissionData = await permissionRes.json();
            if (!permissionData.success) {
                throw new Error(permissionData.message || 'Error al obtener permiso de subida');
            }

            const { uploadUrl, fileKey } = permissionData.data;

            // 2. Prepare the payload buffer
            let uploadBody: Blob | File;

            // Si estamos en Web, document-picker provee una instancia pura de File
            if (selectedFile.file) {
                uploadBody = selectedFile.file;
            } else {
                // Para iOS/Android tenemos que leer desde el native URI
                const fileResponse = await fetch(selectedFile.uri);
                uploadBody = await fileResponse.blob();
            }

            // 3. Upload directly to GCS
            const gcsResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': contentType,
                },
                body: uploadBody,
            });

            if (!gcsResponse.ok) {
                throw new Error('Error al subir el archivo a Google Cloud Storage');
            }

            // 4. Confirm upload with our backend to sync Database
            const confirmRes = await fetch(`${ROUTES.API_ROUTE}${ROUTES.API_COMPANIES}/${companyId}/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileName,
                    typeId: selectedTypeId,
                    fileKey
                })
            });

            const confirmData = await confirmRes.json();
            if (!confirmData.success) {
                throw new Error('Archivo subido, pero no se pudo registrar en la base de datos');
            }

            showToast({ type: 'success', message: 'Éxito', description: 'Documento subido correctamente' });
            onSuccess();
        } catch (error) {
            console.error("Upload error:", error);
            showToast({
                type: 'error',
                message: 'Error al subir',
                description: error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const typeOptions = types.map(t => ({
        label: t.type,
        value: t.id,
        icon: <LinkIcon size={18} color="#64748b" />
    }));

    return (
        <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.formCard}>

                {/* File Picker */}
                <Pressable
                    onPress={handlePickDocument}
                    style={({ pressed }) => [
                        styles.pickerBox,
                        pressed && { opacity: 0.8 },
                        selectedFile && styles.pickerBoxSelected
                    ]}
                >
                    <UploadCloud size={32} color={selectedFile ? "#059669" : "#64748b"} />
                    <Text style={[styles.pickerText, selectedFile && { color: "#059669" }]}>
                        {selectedFile ? 'Cambiar archivo seleccionado' : 'Toca para seleccionar un archivo'}
                    </Text>
                </Pressable>

                {selectedFile && (
                    <>
                        {/* File Name Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Nombre del documento</Text>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputIconContainer}>
                                    <FileText size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    value={fileName}
                                    onChangeText={setFileName}
                                    placeholder="Ej: Contrato_2024.pdf"
                                    placeholderTextColor="#64748b"
                                />
                            </View>
                        </View>

                        {/* Document Type Select */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Tipo de documento</Text>
                            <SelectDropdown
                                options={typeOptions}
                                selectedValue={selectedTypeId || undefined}
                                onSelect={(val) => setSelectedTypeId(Number(val))}
                                placeholder={loadingTypes ? 'Cargando...' : 'Selecciona el tipo'}
                                disabled={loadingTypes || types.length === 0}
                                icon={<LinkIcon size={20} color="#3b82f6" />}
                            />
                        </View>
                    </>
                )}

                {/* Submit Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.submitButton,
                        (!selectedFile || !fileName || !selectedTypeId || isUploading || pressed) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleUpload}
                    disabled={!selectedFile || !fileName || !selectedTypeId || isUploading}
                >
                    <LinearGradient
                        colors={
                            (!selectedFile || !fileName || !selectedTypeId || isUploading)
                                ? ['#94a3b8', '#64748b']
                                : ['#10b981', '#047857']
                        }
                        style={styles.submitButtonGradient}
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <UploadCloud size={20} color="#ffffff" />
                                <Text style={styles.submitButtonText}>Subir a la Nube</Text>
                            </>
                        )}
                    </LinearGradient>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        paddingTop: 10,
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
    },
    pickerBox: {
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#f8fafc',
    },
    pickerBoxSelected: {
        borderColor: '#10b981',
        backgroundColor: '#ecfdf5',
    },
    pickerText: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#64748b',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputIconContainer: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#1e293b',
    },
    submitButton: {
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        minHeight: 54,
        gap: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#ffffff',
    },
});
