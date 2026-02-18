import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MyRoute } from '@/lib/types/types';
import { QuickAction } from '@/lib/constants';

interface QuickMenuProps {
	quickActions: QuickAction[];
}

export default function QuickMenu({ quickActions }: QuickMenuProps) {
	const handleQuickAction = (route: MyRoute): void => {
		router.push(route);
	};

	return (
		<View style={styles.quickActionsContainer}>
			<Text style={styles.quickActionsTitle}>Acceso Rápido</Text>
			<View style={styles.quickActionsGrid}>
				{quickActions.map((action) => (
					<TouchableOpacity
						key={action.id}
						style={styles.quickActionCard}
						onPress={() => handleQuickAction(action.route)}
						activeOpacity={0.7}
					>
						<View
							style={[
								styles.quickActionIcon,
								{ backgroundColor: `${action.color}20` },
							]}
						>
							<action.icon size={24} color={action.color} />
						</View>
						<Text style={styles.quickActionTitle}>{action.title}</Text>
						<Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

export const styles = StyleSheet.create({
	quickActionsContainer: {
		paddingTop: 20,
		marginBottom: 24,
	},
	quickActionsTitle: {
		fontSize: 20,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
	},
	quickActionsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
	},
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
