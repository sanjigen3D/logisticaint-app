import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { quickActionLogOut, quickActionsAccount } from '@/lib/constants';
import { useAuthStore } from '@/lib/stores/authStore';
import { StyleSheet, View } from 'react-native';

export default function AccountHomeScreen() {
	const { isAuthenticated } = useAuthStore();

	const currentActions = isAuthenticated
		? quickActionsAccount.map(action => action.title === 'Iniciar Sesión' ? quickActionLogOut[0] : action)
		: quickActionsAccount;

	return (
		<View style={[styles.container]}>
			<QuickMenu quickActions={currentActions} type="quick" />
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
});
