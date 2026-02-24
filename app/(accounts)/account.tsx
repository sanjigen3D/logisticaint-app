import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { quickActionLogOut, quickActionsAccount, quickActionsAdmin } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { StyleSheet, View } from 'react-native';

export default function AccountHomeScreen() {
	const { isAuthenticated, isManagerOrHigher } = useAuth();

	const currentActions = isAuthenticated
		? quickActionsAccount.map(action => action.title === 'Iniciar Sesión' ? quickActionLogOut[0] : action)
		: quickActionsAccount;

	return (
		<View style={[styles.container]}>
			<QuickMenu quickActions={currentActions} type="quick" />
			{isAuthenticated && isManagerOrHigher() && (
				<QuickMenu quickActions={quickActionsAdmin} type="admin" />
			)}
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
