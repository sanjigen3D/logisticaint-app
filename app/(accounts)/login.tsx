import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Navbar from '@/components/UI/navbar';

// Zod validation schema
const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Ingresa un email válido')
		.toLowerCase(),
	password: z
		.string()
		.min(1, 'La contraseña es requerida')
		.min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);

		// Simular API call
		setTimeout(() => {
			setIsLoading(false);
			Alert.alert(
				'Login Exitoso',
				`Bienvenido de vuelta!\nEmail: ${data.email}`,
				[{ text: 'OK' }],
			);
		}, 1500);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				{/* Header */}
				<Navbar
					title={'Iniciar Sesión'}
					subtitle={'Accede a tu cuenta'}
					icon={<LogIn size={32} color="#ffffff" />}
				/>

				{/* Main Content Container */}
				<View style={styles.mainContainer}>
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
											<Text style={styles.errorText}>
												{errors.email.message}
											</Text>
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
											<Text style={styles.errorText}>
												{errors.password.message}
											</Text>
										)}
									</View>
								)}
							/>

							{/* Login Button */}
							<TouchableOpacity
								style={[
									styles.loginButton,
									!isValid && styles.loginButtonDisabled,
								]}
								onPress={handleSubmit(handleLogin)}
								disabled={!isValid || isLoading}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={
										!isValid ? ['#94a3b8', '#64748b'] : ['#3b82f6', '#1e40af']
									}
									style={styles.loginButtonGradient}
								>
									<LogIn size={20} color="#ffffff" />
									<Text style={styles.loginButtonText}>
										{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	header: {
		paddingTop: Platform.OS === 'ios' ? 60 : 40,
		paddingBottom: 40,
	},
	headerContainer: {
		width: '100%',
		maxWidth: 1200,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	headerContent: {
		alignItems: 'center',
	},
	iconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
	},
	headerTitle: {
		fontSize: 28,
		fontFamily: 'Inter-Bold',
		color: '#ffffff',
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#bfdbfe',
		textAlign: 'center',
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 500,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	formContainer: {
		paddingTop: 20,
	},
	formCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
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
