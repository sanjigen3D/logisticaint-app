import { QuickMenuCard } from '@/components/UI/Tabs/QuickMenuCard';
import { QuickAction } from '@/lib/constants';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

interface QuickMenuProps {
	quickActions: QuickAction[];
	type: 'quick' | 'admin' | 'none';
}

const GAP = 14;
const CONTENT_MAX_WIDTH = 1024;
const HORIZONTAL_PADDING = 40; // 20px each side from content container

function getColumns(width: number): number {
	if (width >= 720) return 3;
	if (width >= 540) return 2;
	return 1;
}

export default function QuickMenu({ quickActions, type }: QuickMenuProps) {
	const { width } = useWindowDimensions();
	const columns = getColumns(width);

	// Cap at content max width (1024) — on large screens the container is centered/capped
	const effectiveWidth = Math.min(width, CONTENT_MAX_WIDTH) - HORIZONTAL_PADDING;
	const cardWidth = (effectiveWidth - GAP * (columns - 1)) / columns;

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
			<View style={[styles.grid, { gap: GAP }]}>
				{quickActions.map((action) => (
					<QuickMenuCard
						quickAction={action}
						key={action.id}
						cardWidth={cardWidth}
					/>
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
	},
});
