import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { CreateCompanyFormData } from '@/lib/types/types';
import { createCompanySchema } from '@/lib/validations/schemas';
import { companyService } from '@/services/companyService';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    BookText,
    Building2,
    CreditCard,
    MapPin,
    Tag
} from 'lucide-react-native';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export const CreateCompanyForm = () => {
    const { token, isAdmin } = useAuth();
    const { showToast } = useToastStore();
    const router = useRouter();

    // Guard: solo Admin puede crear empresas
    useEffect(() => {
        if (!isAdmin()) {
            showToast({
                type: 'error',
                message: 'Acceso restringido',
                description: 'Solo los Administradores pueden crear empresas.',
            });
            router.replace('/(tabs)');
        }
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
    } = useForm<CreateCompanyFormData>({
        resolver: zodResolver(createCompanySchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            razon_social: '',
            rut: '',
            direccion: '',
            alias: '',
        },
    });

    const handleCreateCompany = async (data: CreateCompanyFormData) => {
        if (!token) {
            showToast({
                type: 'error',
                message: 'Error de autenticación',
                description: 'No se encontró un token válido. Vuelve a iniciar sesión.',
            });
            return;
        }

        try {
            await companyService.createCompany(data, token);
            reset();
            showToast({
                type: 'success',
                message: '¡Empresa creada!',
                description: `La empresa "${data.name}" fue creada exitosamente.`,
            });
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Error al crear empresa',
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
                <Text style={styles.formTitle}>Crear Nueva Empresa</Text>
                <Text style={styles.formSubtitle}>
                    Completa los datos para registrar una nueva empresa en el sistema
                </Text>

                {/* Nombre */}
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Nombre de la empresa</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.name && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <Building2 size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nombre comercial"
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

                {/* Razón Social */}
                <Controller
                    control={control}
                    name="razon_social"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Razón Social</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.razon_social && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <BookText size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Razón Social S.A."
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.razon_social && (
                                <Text style={styles.errorText}>{errors.razon_social.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* RUT */}
                <Controller
                    control={control}
                    name="rut"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>RUT</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.rut && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <CreditCard size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="12.345.678-9"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.rut && (
                                <Text style={styles.errorText}>{errors.rut.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Dirección */}
                <Controller
                    control={control}
                    name="direccion"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Dirección</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.direccion && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <MapPin size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Calle Ejemplo 123, Ciudad"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.direccion && (
                                <Text style={styles.errorText}>{errors.direccion.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Alias */}
                <Controller
                    control={control}
                    name="alias"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Alias</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.alias && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <Tag size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nombre corto o alias"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.alias && (
                                <Text style={styles.errorText}>{errors.alias.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Submit Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.submitButton,
                        (!isValid || isSubmitting || pressed) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit(handleCreateCompany)}
                    disabled={!isValid || isSubmitting}
                >
                    <LinearGradient
                        colors={
                            !isValid || isSubmitting
                                ? ['#94a3b8', '#64748b']
                                : ['#059669', '#047857']
                        }
                        style={styles.submitButtonGradient}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <Building2 size={20} color="#ffffff" />
                                <Text style={styles.submitButtonText}>Crear Empresa</Text>
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
