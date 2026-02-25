import { QuickMenuCard } from '@/components/UI/Tabs/QuickMenuCard';
import { QuickAction } from '@/lib/constants';
import { StyleSheet, Text, View } from 'react-native';

interface QuickMenuProps {
	quickActions: QuickAction[];
	type: 'quick' | 'admin' | 'none';
}

export default function QuickMenu({ quickActions, type }: QuickMenuProps) {
	const label =
		type === 'quick'
			? 'Acceso Rápido'
			: type === 'admin'
				? 'Panel de Administración'
				: '';

	const accentColor =
		type === 'admin' ? '#7c3aed' : '#1e40af';

	return (
		<View style={styles.container}>
			{label ? (
				<View style={styles.titleRow}>
					<View style={[styles.titleAccent, { backgroundColor: accentColor }]} />
					<Text style={styles.title}>{label}</Text>
				</View>
			) : null}
			<View style={styles.grid}>
				{quickActions.map((action) => (
					<QuickMenuCard quickAction={action} key={action.id} />
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		gap: 10,
	},
	titleAccent: {
		width: 4,
		height: 20,
		borderRadius: 3,
	},
	title: {
		fontSize: 17,
		fontFamily: 'Inter-SemiBold',
		color: '#0f172a',
		letterSpacing: 0.2,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 14,
	},
});
