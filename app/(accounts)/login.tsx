import {
	View,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { LoginForm } from '@/components/forms/login/LoginForm';

export default function LoginScreen() {
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
				<View style={styles.mainContainer}>
					<LoginForm />
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
	mainContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 500,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});
