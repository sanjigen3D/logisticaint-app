import { View, StyleSheet, Text } from 'react-native';
import { QuickAction } from '@/lib/constants';
import { QuickMenuCard } from '@/components/UI/Tabs/QuickMenuCard';

interface QuickMenuProps {
	quickActions: QuickAction[];
}

export default function QuickMenu({ quickActions }: QuickMenuProps) {
	return (
		<View style={styles.quickActionsContainer}>
			<Text style={styles.quickActionsTitle}>Acceso Rápido</Text>
			<View style={styles.quickActionsGrid}>
				{quickActions.map((action) => (
					<QuickMenuCard quickAction={action} key={action.id} />
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
});
