import { SelectDropdown } from '@/components/UI/SelectDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company, CreateContactFormData } from '@/lib/types/types';
import { createContactSchema } from '@/lib/validations/schemas';
import { companyService } from '@/services/companyService';
import { contactService } from '@/services/contactService';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Building2,
    Mail,
    Phone,
    User,
    UserCheck,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export const CreateContactForm = () => {
    const { token, isManagerOrHigher } = useAuth();
    const { showToast } = useToastStore();
    const router = useRouter();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    // Guard: Manager o superior puede crear contactos
    useEffect(() => {
        if (!isManagerOrHigher()) {
            showToast({
                type: 'error',
                message: 'Acceso restringido',
                description: 'No tienes permisos para acceder a esta sección.',
            });
            router.replace('/(tabs)');
        } else {
            fetchCompanies();
        }
    }, []);

    const fetchCompanies = async () => {
        if (!token) return;
        setLoadingCompanies(true);
        try {
            const data = await companyService.getCompanies(token);
            setCompanies(data);
        } catch {
            showToast({
                type: 'error',
                message: 'Error al cargar empresas',
                description: 'No se pudieron cargar las empresas disponibles.',
            });
        } finally {
            setLoadingCompanies(false);
        }
    };

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
    } = useForm<CreateContactFormData>({
        resolver: zodResolver(createContactSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            phone: '',
            email: '',
        },
    });

    const handleCreateContact = async (data: CreateContactFormData) => {
        if (!token) {
            showToast({
                type: 'error',
                message: 'Error de autenticación',
                description: 'No se encontró un token válido. Vuelve a iniciar sesión.',
            });
            return;
        }

        try {
            await contactService.createContact(data, token);
            reset();
            showToast({
                type: 'success',
                message: '¡Contacto creado!',
                description: `El contacto "${data.name}" fue creado exitosamente.`,
            });
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Error al crear contacto',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Ocurrió un error inesperado.',
            });
        }
    };

    return (
        <ScrollView
            style={styles.formContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.formCard}>
                <Text style={styles.formTitle}>Crear Nuevo Contacto</Text>
                <Text style={styles.formSubtitle}>
                    Asocia un contacto a una empresa existente en el sistema
                </Text>

                {/* Nombre */}
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Nombre completo</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.name && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <User size={20} color="#0284c7" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nombre del contacto"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.name && (
                                <Text style={styles.errorText}>{errors.name.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Teléfono */}
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Teléfono</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.phone && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <Phone size={20} color="#0284c7" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="+56912345678"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.phone && (
                                <Text style={styles.errorText}>{errors.phone.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Email */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.email && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <Mail size={20} color="#0284c7" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="contacto@empresa.com"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Empresa - SelectDropdown */}
                <Controller
                    control={control}
                    name="company_id"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Empresa asociada</Text>
                            <SelectDropdown
                                options={companies.map((c) => ({
                                    label: c.name,
                                    value: c.id,
                                    icon: <Building2 size={18} color="#64748b" />,
                                }))}
                                selectedValue={value}
                                onSelect={(val) => onChange(Number(val))}
                                placeholder={loadingCompanies ? 'Cargando empresas...' : 'Seleccionar empresa'}
                                disabled={loadingCompanies || companies.length === 0}
                                error={!!errors.company_id}
                                icon={<Building2 size={20} color="#0284c7" />}
                            />
                            {errors.company_id && (
                                <Text style={styles.errorText}>{errors.company_id.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (!isValid || isSubmitting) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit(handleCreateContact)}
                    disabled={!isValid || isSubmitting}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            !isValid || isSubmitting
                                ? ['#94a3b8', '#64748b']
                                : ['#0284c7', '#0369a1']
                        }
                        style={styles.submitButtonGradient}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <UserCheck size={20} color="#ffffff" />
                                <Text style={styles.submitButtonText}>Crear Contacto</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        paddingTop: 20,
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    formTitle: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#1e293b',
        marginBottom: 8,
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#64748b',
        marginBottom: 32,
        textAlign: 'center',
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
