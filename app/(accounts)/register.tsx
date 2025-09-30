import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
	UserPlus,
	User,
	Building,
	Mail,
	X,
	CheckCircle,
} from 'lucide-react-native';
import Navbar from '@/components/UI/navbar';
import { registerSchema } from '@/lib/validations/schemas';
import { RegisterFormData } from '@/lib/types/types';
import { ROUTES } from '@/lib/Routes';

export default function RegisterScreen() {
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [registeredUserData, setRegisteredUserData] =
		useState<RegisterFormData | null>(null);

	const {
		control,
		handleSubmit,
		reset,
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

		try {
			const response = await fetch(ROUTES.API_RESEND_REGISTER, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const resJson = await response.json();

			if (response.status !== 200) {
				console.error(resJson);
				setIsLoading(false);
				// TODO MODAL DE ERROR
				setRegisteredUserData(null);
				reset();
				return;
			}

			setIsLoading(false);
			setRegisteredUserData(data);
			setShowSuccessModal(true);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCloseModal = () => {
		setShowSuccessModal(false);
		setRegisteredUserData(null);
		reset(); // resetea el formulario
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
								Al crear una cuenta, uno de nuestros ejecutivos se contactara
								contigo al correo ingresado.
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>

			<Modal
				visible={showSuccessModal}
				transparent={true}
				animationType="fade"
				onRequestClose={handleCloseModal}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<TouchableOpacity
							style={styles.modalCloseButton}
							onPress={handleCloseModal}
							activeOpacity={0.7}
						>
							<X size={24} color="#64748b" />
						</TouchableOpacity>

						<View style={styles.modalContent}>
							<View style={styles.modalIconContainer}>
								<CheckCircle size={64} color="#0b3477" />
							</View>

							<Text style={styles.modalTitle}>¡Cuenta Creada!</Text>
							<Text style={styles.modalSubtitle}>
								Tu cuenta ha sido creada exitosamente
							</Text>

							{registeredUserData && (
								<View style={styles.modalUserInfo}>
									<Text style={styles.modalUserName}>
										{registeredUserData.firstName} {registeredUserData.lastName}
									</Text>
									<Text style={styles.modalUserCompany}>
										{registeredUserData.company}
									</Text>
									<Text style={styles.modalUserEmail}>
										{registeredUserData.email}
									</Text>
								</View>
							)}

							<View style={styles.modalEmailInfo}>
								<Mail size={20} color="#3b82f6" />
								<Text style={styles.modalEmailText}>
									Se ha enviado un correo a uno de nuestros ejecutivos para
									habilitar la creación de tu cuenta.
								</Text>
							</View>

							<TouchableOpacity
								style={styles.modalButton}
								onPress={handleCloseModal}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={['#07174c', '#0b3477']}
									style={styles.modalButtonGradient}
								>
									<Text style={styles.modalButtonText}>Entendido</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	modalContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 20,
		width: '100%',
		maxWidth: 400,
		position: 'relative',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 25,
	},
	modalCloseButton: {
		position: 'absolute',
		top: 16,
		right: 16,
		zIndex: 1,
		padding: 8,
		borderRadius: 20,
		backgroundColor: '#f8fafc',
	},
	modalContent: {
		padding: 32,
		alignItems: 'center',
	},
	modalIconContainer: {
		marginBottom: 24,
	},
	modalTitle: {
		fontSize: 24,
		fontFamily: 'Inter-Bold',
		color: '#1e293b',
		marginBottom: 8,
		textAlign: 'center',
	},
	modalSubtitle: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginBottom: 24,
		textAlign: 'center',
	},
	modalUserInfo: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		padding: 16,
		width: '100%',
		marginBottom: 24,
		alignItems: 'center',
	},
	modalUserName: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 4,
	},
	modalUserCompany: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#475569',
		marginBottom: 4,
	},
	modalUserEmail: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	modalEmailInfo: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		backgroundColor: '#eff6ff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
		width: '100%',
	},
	modalEmailText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#1e40af',
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
	},
	modalButton: {
		borderRadius: 12,
		overflow: 'hidden',
		width: '100%',
	},
	modalButtonGradient: {
		paddingVertical: 16,
		paddingHorizontal: 24,
		alignItems: 'center',
	},
	modalButtonText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
	},
});
