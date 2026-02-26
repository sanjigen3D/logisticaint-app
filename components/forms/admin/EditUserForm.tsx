import { SelectDropdown } from '@/components/UI/SelectDropdown';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company } from '@/lib/types/types';
import { editUserSchema } from '@/lib/validations/schemas';
import { companyService } from '@/services/companyService';
import { userService } from '@/services/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Building2,
    Mail,
    Save,
    User,
    UserCog,
} from 'lucide-react-native';
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

const ALL_TYPE_OPTIONS = [
    { label: 'Administrador', value: 1, icon: <UserCog size={18} color="#64748b" /> },
    { label: 'Manager', value: 2, icon: <UserCog size={18} color="#64748b" /> },
    { label: 'Usuario', value: 3, icon: <UserCog size={18} color="#64748b" /> },
];

const MANAGER_TYPE_OPTIONS = ALL_TYPE_OPTIONS.filter((o) => o.value >= 2);

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
    userItem: any; // The User object passed from the list
    onSuccess: () => void;
}

export const EditUserForm = ({ userItem, onSuccess }: EditUserFormProps) => {
    const { token, isAdmin } = useAuth();
    const { showToast } = useToastStore();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    const typeOptions = isAdmin() ? ALL_TYPE_OPTIONS : MANAGER_TYPE_OPTIONS;

    useEffect(() => {
        fetchCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // Helper to map string type to id
    const getTypeId = (typeStr: string) => {
        if (typeStr === 'Admin') return 1;
        if (typeStr === 'Manager') return 2;
        return 3;
    };

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
        mode: 'onChange',
        defaultValues: {
            name: userItem.name,
            email: userItem.email,
            type_id: getTypeId(userItem.type),
            company_id: userItem.company_id,
            active: userItem.active,
        },
    });

    const handleEditUser = async (data: EditUserFormData) => {
        if (!token) return;
        try {
            await userService.updateUser(userItem.id, data, token);
            showToast({
                type: 'success',
                message: '¡Usuario actualizado!',
                description: `El usuario "${data.name}" fue actualizado exitosamente.`,
            });
            onSuccess();
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Error',
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
                        <Text style={styles.inputLabel}>Nombre completo</Text>
                        <View style={[styles.inputContainer, errors.name && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <User size={20} color="#3b82f6" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Nombre constante"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                                autoCapitalize="words"
                                autoCorrect={false}
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
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </View>
                )}
            />

            {/* User Type - SelectDropdown */}
            <Controller
                control={control}
                name="type_id"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Tipo de usuario</Text>
                        <SelectDropdown
                            options={typeOptions}
                            selectedValue={value}
                            onSelect={(val) => onChange(Number(val))}
                            placeholder="Seleccionar tipo de usuario"
                            error={!!errors.type_id}
                            icon={<UserCog size={20} color="#3b82f6" />}
                        />
                        {errors.type_id && <Text style={styles.errorText}>{errors.type_id.message}</Text>}
                    </View>
                )}
            />

            {/* Company - SelectDropdown */}
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
                            placeholder={loadingCompanies ? 'Cargando empresas...' : 'Seleccionar empresa'}
                            disabled={loadingCompanies || companies.length === 0}
                            error={!!errors.company_id}
                            icon={<Building2 size={20} color="#3b82f6" />}
                        />
                        {errors.company_id && <Text style={styles.errorText}>{errors.company_id.message}</Text>}
                    </View>
                )}
            />

            {/* Active Status */}
            <Controller
                control={control}
                name="active"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.switchWrapper}>
                        <Text style={styles.inputLabel}>Estado de la cuenta (Activa)</Text>
                        <Switch
                            value={value}
                            onValueChange={onChange}
                            trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
                            thumbColor={value ? '#ffffff' : '#f8fafc'}
                        />
                    </View>
                )}
            />

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
                onPress={handleSubmit(handleEditUser)}
                disabled={!isValid || isSubmitting}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={!isValid || isSubmitting ? ['#94a3b8', '#64748b'] : ['#3b82f6', '#1e40af']}
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
