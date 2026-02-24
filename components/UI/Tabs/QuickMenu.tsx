import { QuickMenuCard } from '@/components/UI/Tabs/QuickMenuCard';
import { QuickAction } from '@/lib/constants';
import { StyleSheet, Text, View } from 'react-native';

interface QuickMenuProps {
	quickActions: QuickAction[];
	type: "quick" | "admin" | "none"
}

export default function QuickMenu({ quickActions, type }: QuickMenuProps) {
	const title = type === "quick" ? "Acceso Rápido" : type === "admin" ? "Panel de Administración" : "";
	return (
		<View style={styles.quickActionsContainer}>
			<Text style={styles.quickActionsTitle}>{title}</Text>
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
