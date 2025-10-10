import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RegisterFormData } from '@/lib/types/types';
import { RequestNewUser } from '@/components/forms/requestNewUser/RequestNewUser';
import { ModalRequestNewUser } from '@/components/forms/requestNewUser/ModalRequestNewUser';

export default function RegisterScreen() {
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [registeredUserData, setRegisteredUserData] =
		useState<RegisterFormData | null>(null);

	const handleCloseModal = () => {
		setShowSuccessModal(false);
		setRegisteredUserData(null);
	};

	return (
		<>
			<View style={styles.registerContainer}>
				<RequestNewUser
					setRegisteredUserData={setRegisteredUserData}
					setShowSuccessModal={setShowSuccessModal}
				/>
			</View>
			<ModalRequestNewUser
				showSuccessModal={showSuccessModal}
				userData={registeredUserData}
				handleCloseModal={handleCloseModal}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	registerContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});
