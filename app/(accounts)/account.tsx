import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import UserProfileCard from '@/components/UI/UserProfileCard';
import { quickActionLogOut, quickActionsAccount } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { Platform, ScrollView, StyleSheet } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export default function AccountHomeScreen() {
	const { isAuthenticated } = useAuth();

	const currentActions = isAuthenticated
		? quickActionsAccount.map((action) =>
			action.title === 'Iniciar Sesión' ? quickActionLogOut[0] : action,
		)
		: quickActionsAccount;

	return (
		<ScrollView
			style={styles.scroll}
			contentContainerStyle={styles.content}
			showsVerticalScrollIndicator={false}
		>
			{/* Profile card — only when authenticated */}
			{isAuthenticated && <UserProfileCard />}

			<QuickMenu quickActions={currentActions} type="quick" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	content: {
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: TAB_BAR_HEIGHT,
	},
});
