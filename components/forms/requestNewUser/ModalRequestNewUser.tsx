import { RegisterFormData } from '@/lib/types/types';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Mail, X } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export const ModalRequestNewUser = ({
	showSuccessModal,
	userData,
	handleCloseModal,
}: {
	showSuccessModal: boolean;
	userData: RegisterFormData | null;
	handleCloseModal: () => void;
}) => {
	return (
		<Modal
			visible={showSuccessModal}
			transparent={true}
			animationType="fade"
			onRequestClose={handleCloseModal}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<Pressable
						style={({ pressed }) => [
							styles.modalCloseButton,
							pressed && { opacity: 0.7 }
						]}
						onPress={handleCloseModal}
					>
						<X size={24} color="#64748b" />
					</Pressable>

					<View style={styles.modalContent}>
						<View style={styles.modalIconContainer}>
							<CheckCircle size={64} color="#0b3477" />
						</View>

						<Text style={styles.modalTitle}>¡Cuenta Creada!</Text>
						<Text style={styles.modalSubtitle}>
							Tu cuenta ha sido creada exitosamente
						</Text>

						{userData && (
							<View style={styles.modalUserInfo}>
								<View>
									<Text style={styles.modalUserName}>
										{userData.firstName} {userData.lastName}
									</Text>
									<Text style={styles.modalUserCompany}>
										{userData.company}
									</Text>
									<Text style={styles.modalUserEmail}>{userData.email}</Text>
								</View>
							</View>
						)}

						<View style={styles.modalEmailInfo}>
							<Mail size={20} color="#3b82f6" />
							<Text style={styles.modalEmailText}>
								Se ha enviado un correo a uno de nuestros ejecutivos para
								habilitar la creación de tu cuenta.
							</Text>
						</View>

						<Pressable
							style={({ pressed }) => [
								styles.modalButton,
								pressed && { opacity: 0.8 }
							]}
							onPress={handleCloseModal}
						>
							<LinearGradient
								colors={['#07174c', '#0b3477']}
								style={styles.modalButtonGradient}
							>
								<Text style={styles.modalButtonText}>Entendido</Text>
							</LinearGradient>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
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
		maxWidth: 800,
		position: 'relative',
		boxShadow: '0px 10px 20px rgba(0,0,0, 0.25)',
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
