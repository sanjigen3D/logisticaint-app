import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormData } from '@/lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/schemas';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
} from 'react-native';

import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLogin } from '@/lib/services/auth.service';
import { useAuthContext } from '@/lib/contexts/AuthContext';

export const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { clearError } = useAuthContext();
	const loginMutation = useLogin();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const handleLogin = async (data: LoginFormData) => {
		try {
			clearError(); // Limpiar errores previos
			await loginMutation.mutateAsync(data);
			// El éxito se maneja automáticamente en el hook useLogin
			reset(); // Limpiar el formulario
		} catch (error: any) {
			// Mostrar error al usuario
			Alert.alert(
				'Error de autenticación',
				error.message || 'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
				[{ text: 'OK' }]
			);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<View style={styles.formContainer}>
			<View style={styles.formCard}>
				<Text style={styles.formTitle}>Bienvenido de vuelta</Text>
				<Text style={styles.formSubtitle}>
					Ingresa tus credenciales para continuar
				</Text>

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
									placeholder="tu@email.com"
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
									placeholder="Tu contraseña"
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

				{/* Login Button */}
				<TouchableOpacity
					style={[styles.loginButton, !isValid && styles.loginButtonDisabled]}
					onPress={handleSubmit(handleLogin)}
					disabled={!isValid || loginMutation.isPending}
					activeOpacity={0.8}
				>
					<LinearGradient
						colors={!isValid ? ['#94a3b8', '#64748b'] : ['#3b82f6', '#1e40af']}
						style={styles.loginButtonGradient}
					>
						<LogIn size={20} color="#ffffff" />
						<Text style={styles.loginButtonText}>
							{loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
						</Text>
					</LinearGradient>
				</TouchableOpacity>

				{/* Forgot Password NOT IMPLEMENTED*/}
				{/*<TouchableOpacity style={styles.forgotPasswordButton}>*/}
				{/*	<Text style={styles.forgotPasswordText}>*/}
				{/*		¿Olvidaste tu contraseña?*/}
				{/*	</Text>*/}
				{/*</TouchableOpacity>*/}
			</View>
		</View>
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
	errorText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#ef4444',
		marginTop: 8,
		marginLeft: 4,
	},
	loginButton: {
		marginTop: 8,
		borderRadius: 12,
		overflow: 'hidden',
	},
	loginButtonDisabled: {
		opacity: 0.6,
	},
	loginButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	loginButtonText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
		marginLeft: 8,
	},
	forgotPasswordButton: {
		marginTop: 16,
		alignItems: 'center',
	},
	forgotPasswordText: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#3b82f6',
	},
});
