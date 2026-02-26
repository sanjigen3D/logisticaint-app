import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { LoginFormData } from '@/lib/types/types';
import { loginSchema } from '@/lib/validations/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';

export const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, error, isLoading, clearError } = useAuth();
	const router = useRouter();
	const { showToast } = useToastStore();

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
		clearError();
		try {
			await login(data.email, data.password);
			reset();

			// Se muestra el Toast general para Web y Mobile
			showToast({
				type: 'success',
				message: '¡Bienvenido!',
				description: 'Has iniciado sesión exitosamente. 👋',
			});

			router.replace('/(tabs)');
		} catch (error) {
			console.error('Error en login:', error);
			showToast({
				type: 'error',
				message: 'Error de autenticación',
				description: error instanceof Error ? error.message : 'Verifica tus credenciales.',
			});
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

				{error && (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>{error}</Text>
					</View>
				)}

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
								<Pressable
									style={({ pressed }) => [
										styles.passwordToggle,
										pressed && { opacity: 0.7 }
									]}
									onPress={togglePasswordVisibility}
								>
									{showPassword ? (
										<EyeOff size={20} color="#64748b" />
									) : (
										<Eye size={20} color="#64748b" />
									)}
								</Pressable>
							</View>
							{errors.password && (
								<Text style={styles.errorText}>{errors.password.message}</Text>
							)}
						</View>
					)}
				/>

				{/* Login Button */}
				<Pressable
					style={({ pressed }) => [
						styles.loginButton,
						(!isValid || isLoading || pressed) && styles.loginButtonDisabled,
					]}
					onPress={handleSubmit(handleLogin)}
					disabled={!isValid || isLoading}
				>
					<LinearGradient
						colors={
							!isValid || isLoading
								? ['#94a3b8', '#64748b']
								: ['#3b82f6', '#1e40af']
						}
						style={styles.loginButtonGradient}
					>
						<>
							<LogIn size={20} color="#ffffff" />
							<Text style={styles.loginButtonText}>
								{isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
							</Text>
						</>
					</LinearGradient>
				</Pressable>

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
	errorContainer: {
		backgroundColor: '#fef2f2',
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#fecaca',
	},
	errorMessage: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#ef4444',
		textAlign: 'center',
	},
});
