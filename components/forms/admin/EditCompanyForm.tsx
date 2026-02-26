import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Company } from '@/lib/types/types';
import { editCompanySchema } from '@/lib/validations/schemas';
import { companyService } from '@/services/companyService';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Building, Building2, MapPin, Save, Tag } from 'lucide-react-native';
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

type EditCompanyFormData = z.infer<typeof editCompanySchema>;

interface EditCompanyFormProps {
    company: Company;
    onSuccess: () => void;
}

export const EditCompanyForm = ({ company, onSuccess }: EditCompanyFormProps) => {
    const { token } = useAuth();
    const { showToast } = useToastStore();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<EditCompanyFormData>({
        resolver: zodResolver(editCompanySchema),
        mode: 'onChange',
        defaultValues: {
            name: company.name,
            razon_social: company.razon_social,
            rut: company.rut,
            direccion: company.direccion,
            alias: company.alias,
            active: company.active,
        },
    });

    const handleEditCompany = async (data: EditCompanyFormData) => {
        if (!token) return;
        try {
            await companyService.updateCompany(company.id, data, token);
            showToast({
                type: 'success',
                message: '¡Empresa actualizada!',
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
                        <Text style={styles.inputLabel}>Nombre Comercial</Text>
                        <View style={[styles.inputContainer, errors.name && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <Building size={20} color="#059669" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: Logistics Pro"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                            />
                        </View>
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                    </View>
                )}
            />

            {/* Razón Social Input */}
            <Controller
                control={control}
                name="razon_social"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Razón Social</Text>
                        <View style={[styles.inputContainer, errors.razon_social && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <Building2 size={20} color="#059669" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: Logistics Pro SpA"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                            />
                        </View>
                        {errors.razon_social && <Text style={styles.errorText}>{errors.razon_social.message}</Text>}
                    </View>
                )}
            />

            {/* RUT Input */}
            <Controller
                control={control}
                name="rut"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>RUT</Text>
                        <View style={[styles.inputContainer, errors.rut && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <Tag size={20} color="#059669" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: 77.123.456-7"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                            />
                        </View>
                        {errors.rut && <Text style={styles.errorText}>{errors.rut.message}</Text>}
                    </View>
                )}
            />

            {/* Dirección Input */}
            <Controller
                control={control}
                name="direccion"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Dirección</Text>
                        <View style={[styles.inputContainer, errors.direccion && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <MapPin size={20} color="#059669" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: Av. Providencia 1234, Of 501"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                            />
                        </View>
                        {errors.direccion && <Text style={styles.errorText}>{errors.direccion.message}</Text>}
                    </View>
                )}
            />

            {/* Alias Input */}
            <Controller
                control={control}
                name="alias"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Alias</Text>
                        <View style={[styles.inputContainer, errors.alias && styles.inputContainerError]}>
                            <View style={styles.inputIconContainer}>
                                <Tag size={20} color="#059669" />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej: logistics_pro"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholderTextColor="#64748b"
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.alias && <Text style={styles.errorText}>{errors.alias.message}</Text>}
                    </View>
                )}
            />

            {/* Active Status */}
            <Controller
                control={control}
                name="active"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.switchWrapper}>
                        <Text style={styles.inputLabel}>Estado de la empresa (Activa)</Text>
                        <Switch
                            value={value}
                            onValueChange={onChange}
                            trackColor={{ false: '#cbd5e1', true: '#10b981' }}
                            thumbColor={value ? '#ffffff' : '#f8fafc'}
                        />
                    </View>
                )}
            />

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
                onPress={handleSubmit(handleEditCompany)}
                disabled={!isValid || isSubmitting}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={!isValid || isSubmitting ? ['#94a3b8', '#64748b'] : ['#10b981', '#047857']}
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
