import { MyRoute } from '@/lib/types/types';
import { QuickAction } from '@/lib/constants';
import { router } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/lib/stores/authStore';
import { ROUTES } from '@/lib/Routes';

export const QuickMenuCard = ({
	quickAction,
}: {
	quickAction: QuickAction;
}) => {
	const { id, route, color, title, subtitle, isLogOut } = quickAction;
	const { logout } = useAuthStore();

	const handleQuickAction = (route?: MyRoute): void => {
		if (route) {
			return router.push(route);
		}

		if (isLogOut) {
			logout().then(() => router.push(ROUTES.HOME as MyRoute));
		}
	};

	return (
		<TouchableOpacity
			key={id}
			style={styles.quickActionCard}
			onPress={() => handleQuickAction(route)}
			activeOpacity={0.7}
		>
			<View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
				<quickAction.icon size={24} color={color} />
			</View>
			<Text style={styles.quickActionTitle}>{title}</Text>
			<Text style={styles.quickActionSubtitle}>{subtitle}</Text>
		</TouchableOpacity>
	);
};

export const styles = StyleSheet.create({
	quickActionCard: {
		flex: 1,
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 20,
		alignItems: 'center',
		boxShadow: '0px 2px 8px rgba(0,0,0, 0.1)',
	},
	quickActionIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	quickActionTitle: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 4,
		textAlign: 'center',
	},
	quickActionSubtitle: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		textAlign: 'center',
	},
});
