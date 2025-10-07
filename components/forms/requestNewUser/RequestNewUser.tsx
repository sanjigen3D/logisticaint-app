import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Building, Mail, User, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { RegisterFormData } from '@/lib/types/types';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequestNewUserSchema } from '@/lib/validations/schemas';
import { ROUTES } from '@/lib/Routes';
import { LinearGradient } from 'expo-linear-gradient';

export const RequestNewUser = ({
	setRegisteredUserData,
	setShowSuccessModal,
}: {
	setRegisteredUserData: React.Dispatch<
		React.SetStateAction<RegisterFormData | null>
	>;
	setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(RequestNewUserSchema),
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
			reset();
		} catch (error) {
			console.log(error);
		}
	};

	return (
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
								<Text style={styles.errorText}>{errors.firstName.message}</Text>
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
								<Text style={styles.errorText}>{errors.lastName.message}</Text>
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
								<Text style={styles.errorText}>{errors.company.message}</Text>
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
								<Text style={styles.errorText}>{errors.email.message}</Text>
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
						colors={!isValid ? ['#07174c', '#0b3477'] : ['#07174c', '#0b3477']}
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
					Al crear una cuenta, uno de nuestros ejecutivos se contactara contigo
					al correo ingresado.
				</Text>
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
		boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
