import { SelectDropdown } from '@/components/UI/SelectDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company, Contact } from '@/lib/types/types';
import { editContactSchema } from '@/lib/validations/schemas';
import { companyService } from '@/services/companyService';
import { contactService } from '@/services/contactService';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Building2, Mail, Phone, Save, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { z } from 'zod';

type EditContactFormData = z.infer<typeof editContactSchema>;

interface EditContactFormProps {
    contact: Contact;
    onSuccess: () => void;
}

export const EditContactForm = ({ contact, onSuccess }: EditContactFormProps) => {
    const { token, isManagerOrHigher, isAdmin } = useAuth();
    const { showToast } = useToastStore();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    useEffect(() => {
        if (isAdmin()) {
            fetchCompanies();
        }
    }, [isAdmin]);

    const fetchCompanies = async () => {
        if (!token) return;
        setLoadingCompanies(true);
        try {
            const data = await companyService.getCompanies(token);
            setCompanies(data);
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Error al cargar empresas',
                description: 'No se pudieron cargar las empresas.',
            });
        } finally {
            setLoadingCompanies(false);
        }
    };

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<EditContactFormData>({
        resolver: zodResolver(editContactSchema),
        mode: 'onChange',
        defaultValues: {
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            company_id: contact.company_id,
            active: contact.active,
        },
    });

    const handleEditContact = async (data: EditContactFormData) => {
        if (!token) return;
        try {
            await contactService.updateContact(contact.id, data, token);
            showToast({
                type: 'success',
                message: '¡Contacto actualizado!',
                description: `Los datos de "${data.name}" se actualizaron exitosamente.`,
            });
            onSuccess();
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Error al actualizar',
                description: error instanceof Error ? error.message : 'Error inesperado.',
            });
        }
    };

    return (
        <View style={styles.formContainer}>
            {/* Name Input */}
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Nombre del Contacto</Text>
                        <View style={[styles.inputContainer, errors.name && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <User size={20} color="#0284c7" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: Juan Pérez"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                                autoCapitalize="words"
                            />
                        </View>
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                    </View>
                )}
            />

            {/* Email Input */}
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={[styles.inputContainer, errors.email && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <Mail size={20} color="#0284c7" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: juan@ejemplo.com"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </View>
                )}
            />

            {/* Phone Input */}
            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Teléfono</Text>
                        <View style={[styles.inputContainer, errors.phone && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <Phone size={20} color="#0284c7" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: +569 1234 5678"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                                keyboardType="phone-pad"
                            />
                        </View>
                        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                    </View>
                )}
            />

            {/* Company - SelectDropdown (Solo si es Admin global) */}
            {isAdmin() && (
                <Controller
                    control={control}
                    name="company_id"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Empresa asignada</Text>
                            <SelectDropdown
                                options={companies.map(c => ({
                                    label: c.name,
                                    value: c.id,
                                    icon: <Building2 size={18} color="#64748b" />
                                }))}
                                selectedValue={value}
                                onSelect={(val) => onChange(Number(val))}
                                placeholder={loadingCompanies ? 'Cargando...' : 'Selecciona una empresa'}
                                disabled={loadingCompanies || companies.length === 0}
                                error={!!errors.company_id}
                                icon={<Building2 size={20} color="#0284c7" />}
                            />
                            {errors.company_id && <Text style={styles.errorText}>{errors.company_id.message}</Text>}
                        </View>
                    )}
                />
            )}

            {/* Active Status */}
            <Controller
                control={control}
                name="active"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.switchWrapper}>
                        <Text style={styles.inputLabel}>Estado del contacto (Activo)</Text>
                        <Switch
                            value={value}
                            onValueChange={onChange}
                            trackColor={{ false: '#cbd5e1', true: '#0284c7' }}
                            thumbColor={value ? '#ffffff' : '#f8fafc'}
                        />
                    </View>
                )}
            />

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
                onPress={handleSubmit(handleEditContact)}
                disabled={!isValid || isSubmitting}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={!isValid || isSubmitting ? ['#94a3b8', '#64748b'] : ['#0284c7', '#0369a1']}
                    style={styles.submitButtonGradient}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <>
                            <Save size={20} color="#ffffff" />
                            <Text style={styles.submitButtonText}>Guardar Cambios</Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    switchWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 4,
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
    inputContainerError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
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
    errorText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#ef4444',
        marginTop: 8,
        marginLeft: 4,
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
