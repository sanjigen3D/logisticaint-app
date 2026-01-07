import { View, StyleSheet } from 'react-native';
import { LoginForm } from '@/components/forms/login/LoginForm';

export default function LoginScreen() {
	return (
		<View style={styles.loginContainer}>
			<LoginForm />
		</View>
	);
}

const styles = StyleSheet.create({
	loginContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});
