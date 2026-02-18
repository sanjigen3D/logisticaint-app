import { quickActionsHome } from '@/lib/constants';
import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/lib/stores/authStore';

export default function Index() {
	const { user, isAuthenticated } = useAuthStore();

	return (
		<View style={[styles.container]}>
			<Text style={styles.welcomeText}>
				Bienvenido: {isAuthenticated && user ? user.name : ''}
			</Text>
			<QuickMenu quickActions={quickActionsHome} />
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
