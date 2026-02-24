import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { CreateUserFormData } from '@/lib/types/types';
import { createUserSchema } from '@/lib/validations/schemas';
import { userService } from '@/services/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldPlus,
    User,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ALL_TYPE_OPTIONS = [
    { label: 'Admin', value: 1 },
    { label: 'Manager', value: 2 },
    { label: 'User', value: 3 },
];

// Options for user type
const MANAGER_TYPE_OPTIONS = ALL_TYPE_OPTIONS.filter((o) => o.value >= 2);

export const CreateUserForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { token, isAdmin, isManagerOrHigher } = useAuth();
    const { showToast } = useToastStore();
    const router = useRouter();

    // Options for user type
    const typeOptions = isAdmin() ? ALL_TYPE_OPTIONS : MANAGER_TYPE_OPTIONS;

    // Guard: redirect if no permissions
    useEffect(() => {
        if (!isManagerOrHigher()) {
            showToast({
                type: 'error',
                message: 'Acceso restringido',
                description: 'No tienes permisos para acceder a esta sección.',
            });
            router.replace('/(tabs)');
        }
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            type_id: 3,
            active: true,
        },
    });

    const handleCreateUser = async (data: CreateUserFormData) => {
        if (!token) {
            showToast({
                type: 'error',
                message: 'Error de autenticación',
                description: 'No se encontró un token válido. Vuelve a iniciar sesión.',
            });
            return;
        }

        try {
            const result = await userService.createUser(data, token);
            reset();
            showToast({
                type: 'success',
                message: '¡Usuario creado!',
                description: `El usuario "${result.user?.name ?? data.name}" fue creado exitosamente.`,
            });
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Error al crear usuario',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Ocurrió un error inesperado.',
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <ScrollView
            style={styles.formContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.formCard}>
                <Text style={styles.formTitle}>Crear Nuevo Usuario</Text>
                <Text style={styles.formSubtitle}>
                    Completa los datos para registrar un nuevo usuario en el sistema
                </Text>

                {/* Name Input */}
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
                                    <User size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nombre del usuario"
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

                {/* Email Input */}
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
                                    <Mail size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="usuario@correo.com"
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

                {/* Password Input */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.password && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <Lock size={20} color="#3b82f6" />
                                </View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Mínimo 6 caracteres"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor="#64748b"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.passwordToggle}
                                    onPress={togglePasswordVisibility}
                                    activeOpacity={0.7}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color="#64748b" />
                                    ) : (
                                        <Eye size={20} color="#64748b" />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* User Type - Select/Picker */}
                <Controller
                    control={control}
                    name="type_id"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Tipo de usuario</Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.type_id && styles.inputContainerError,
                                ]}
                            >
                                <View style={styles.inputIconContainer}>
                                    <ShieldPlus size={20} color="#3b82f6" />
                                </View>
                                {Platform.OS === 'web' ? (
                                    <select
                                        value={value}
                                        onChange={(e) => onChange(Number(e.target.value))}
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: 16,
                                            fontFamily: 'Inter-Regular',
                                            color: '#1e293b',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {typeOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    /* for mobile: inline selection tabs */
                                    <View style={styles.typeTabsContainer}>
                                        {typeOptions.map((opt) => (
                                            <TouchableOpacity
                                                key={opt.value}
                                                style={[
                                                    styles.typeTab,
                                                    value === opt.value && styles.typeTabActive,
                                                ]}
                                                onPress={() => onChange(opt.value)}
                                                activeOpacity={0.7}
                                            >
                                                <Text
                                                    style={[
                                                        styles.typeTabText,
                                                        value === opt.value && styles.typeTabTextActive,
                                                    ]}
                                                >
                                                    {opt.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            {errors.type_id && (
                                <Text style={styles.errorText}>{errors.type_id.message}</Text>
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
                    onPress={handleSubmit(handleCreateUser)}
                    disabled={!isValid || isSubmitting}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            !isValid || isSubmitting
                                ? ['#94a3b8', '#64748b']
                                : ['#3b82f6', '#1e40af']
                        }
                        style={styles.submitButtonGradient}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <ShieldPlus size={20} color="#ffffff" />
                                <Text style={styles.submitButtonText}>Crear Usuario</Text>
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
    passwordToggle: {
        padding: 4,
    },
    typeTabsContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
    },
    typeTab: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
    },
    typeTabActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    typeTabText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: '#64748b',
    },
    typeTabTextActive: {
        color: '#ffffff',
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

