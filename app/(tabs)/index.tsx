import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { quickActionsHome } from '@/lib/constants';
import { useAuthStore } from '@/lib/stores/authStore';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
	const { user, isAuthenticated } = useAuthStore();

	return (
		<View style={[styles.container]}>
			<Text style={styles.welcomeText}>
				Bienvenido: {isAuthenticated && user ? user.name : ''}
			</Text>
			<QuickMenu quickActions={quickActionsHome} type="quick" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	welcomeText: {
		fontSize: 20,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
		marginTop: 20,
	},
});
