import { quickActionsAccount, quickActionLogOut } from '@/lib/constants';
import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/lib/stores/authStore';

export default function AccountHomeScreen() {
	const { isAuthenticated } = useAuthStore();

	return (
		<View style={[styles.container]}>
			<QuickMenu quickActions={quickActionsAccount} />
			{isAuthenticated && <QuickMenu quickActions={quickActionLogOut} />}
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
