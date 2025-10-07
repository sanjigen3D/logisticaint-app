import { useState } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
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
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				{/* Main Content Container */}
				<View style={styles.mainContainer}>
					<RequestNewUser
						setRegisteredUserData={setRegisteredUserData}
						setShowSuccessModal={setShowSuccessModal}
					/>
				</View>
			</ScrollView>
			<ModalRequestNewUser
				showSuccessModal={showSuccessModal}
				userData={registeredUserData}
				handleCloseModal={handleCloseModal}
			/>
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
	mainContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 500,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});
