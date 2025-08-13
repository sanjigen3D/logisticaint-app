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
import { UserPlus, User, Building, Mail } from 'lucide-react-native';
import Navbar from '@/components/UI/navbar';

// Zod validation schema
const registerSchema = z.object({
	firstName: z
		.string()
		.min(1, 'El nombre es requerido')
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(50, 'El nombre no puede exceder 50 caracteres')
		.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
	lastName: z
		.string()
		.min(1, 'El apellido es requerido')
		.min(2, 'El apellido debe tener al menos 2 caracteres')
		.max(50, 'El apellido no puede exceder 50 caracteres')
		.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
	company: z
		.string()
		.min(1, 'La empresa es requerida')
		.min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
		.max(100, 'El nombre de la empresa no puede exceder 100 caracteres'),
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Ingresa un email válido')
		.toLowerCase(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: 'onChange',
		defaultValues: {
			firstName: '',
			lastName: '',
			company: '',
			email: '',
		},
	});

	const handleRegister = async (data: RegisterFormData) => {
		setIsLoading(true);

		// Simular API call
		setTimeout(() => {
			Alert.alert(
				'Registro Exitoso',
				`¡Cuenta creada exitosamente!\n\nNombre: ${data.firstName} ${data.lastName}\nEmpresa: ${data.company}\nEmail: ${data.email}\n\nRecibirás un email de confirmación pronto.`,
				[{ text: 'OK' }],
			);
			setIsLoading(false);
		}, 2000);
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
					title={'Crear Cuenta'}
					subtitle={'solicita tu cuenta.'}
					icon={<UserPlus size={32} color="#ffffff" />}
				/>

				{/* Main Content Container */}
				<View style={styles.mainContainer}>
					<View style={styles.formContainer}>
						<View style={styles.formCard}>
							<Text style={styles.formTitle}>Información Personal</Text>
							<Text style={styles.formSubtitle}>
								Completa todos los campos para crear tu cuenta
							</Text>

							{/* First Name Input */}
							<Controller
								control={control}
								name="firstName"
								render={({ field: { onChange, onBlur, value } }) => (
									<View style={styles.inputWrapper}>
										<Text style={styles.inputLabel}>Nombre</Text>
										<View
											style={[
												styles.inputContainer,
												errors.firstName && styles.inputContainerError,
											]}
										>
											<View style={styles.inputIconContainer}>
												<User size={20} color="#07174c" />
											</View>
											<TextInput
												style={styles.textInput}
												placeholder="Tu nombre"
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												placeholderTextColor="#64748b"
												autoCapitalize="words"
											/>
										</View>
										{errors.firstName && (
											<Text style={styles.errorText}>
												{errors.firstName.message}
											</Text>
										)}
									</View>
								)}
							/>

							{/* Last Name Input */}
							<Controller
								control={control}
								name="lastName"
								render={({ field: { onChange, onBlur, value } }) => (
									<View style={styles.inputWrapper}>
										<Text style={styles.inputLabel}>Apellido</Text>
										<View
											style={[
												styles.inputContainer,
												errors.lastName && styles.inputContainerError,
											]}
										>
											<View style={styles.inputIconContainer}>
												<User size={20} color="#07174c" />
											</View>
											<TextInput
												style={styles.textInput}
												placeholder="Tu apellido"
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												placeholderTextColor="#64748b"
												autoCapitalize="words"
											/>
										</View>
										{errors.lastName && (
											<Text style={styles.errorText}>
												{errors.lastName.message}
											</Text>
										)}
									</View>
								)}
							/>

							{/* Company Input */}
							<Controller
								control={control}
								name="company"
								render={({ field: { onChange, onBlur, value } }) => (
									<View style={styles.inputWrapper}>
										<Text style={styles.inputLabel}>Empresa</Text>
										<View
											style={[
												styles.inputContainer,
												errors.company && styles.inputContainerError,
											]}
										>
											<View style={styles.inputIconContainer}>
												<Building size={20} color="#07174c" />
											</View>
											<TextInput
												style={styles.textInput}
												placeholder="Nombre de tu empresa"
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												placeholderTextColor="#64748b"
												autoCapitalize="words"
											/>
										</View>
										{errors.company && (
											<Text style={styles.errorText}>
												{errors.company.message}
											</Text>
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
												<Mail size={20} color="#07174c" />
											</View>
											<TextInput
												style={styles.textInput}
												placeholder="tu@empresa.com"
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

							{/* Register Button */}
							<TouchableOpacity
								style={[
									styles.registerButton,
									!isValid && styles.registerButtonDisabled,
								]}
								onPress={handleSubmit(handleRegister)}
								disabled={!isValid || isLoading}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={
										!isValid ? ['#07174c', '#0b3477'] : ['#07174c', '#0b3477']
									}
									style={styles.registerButtonGradient}
								>
									<UserPlus size={20} color="#ffffff" />
									<Text style={styles.registerButtonText}>
										{isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
									</Text>
								</LinearGradient>
							</TouchableOpacity>

							{/* INFO */}
							<Text style={styles.termsText}>
								Al crear una cuenta, uno de nuestros administrativos se
								contactara contigo a la brevedad.
							</Text>
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
		color: '#a7f3d0',
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
	errorText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#ef4444',
		marginTop: 8,
		marginLeft: 4,
	},
	registerButton: {
		marginTop: 8,
		borderRadius: 12,
		overflow: 'hidden',
	},
	registerButtonDisabled: {
		opacity: 0.6,
	},
	registerButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	registerButtonText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
		marginLeft: 8,
	},
	termsText: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		textAlign: 'center',
		marginTop: 16,
		lineHeight: 18,
	},
	termsLink: {
		color: '#10b981',
		fontFamily: 'Inter-Medium',
	},
});
