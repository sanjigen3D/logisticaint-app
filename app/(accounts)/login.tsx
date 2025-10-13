import { View, StyleSheet } from 'react-native';
import { LoginForm } from '@/components/forms/login/LoginForm';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { ROUTES } from '@/lib/Routes';
import { ExternalPathString, Redirect, RelativePathString } from 'expo-router';

export default function LoginScreen() {
	const { isAuthenticated } = useAuthContext();

	if (isAuthenticated) {
		return (
			<Redirect href={ROUTES.HOME as ExternalPathString | RelativePathString} />
		);
	}
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
