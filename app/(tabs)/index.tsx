import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { quickActionsHome } from '@/lib/constants';
import { useAuthStore } from '@/lib/stores/authStore';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const ROLE_LABELS: Record<string, string> = {
	Admin: 'Administrador',
	Manager: 'Gerente',
	User: 'Usuario',
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
	Admin: { bg: '#ede9fe', text: '#6d28d9' },
	Manager: { bg: '#dbeafe', text: '#1d4ed8' },
	User: { bg: '#f0fdf4', text: '#15803d' },
};

// Height of floating tab bar + gap
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export default function Index() {
	const { user, isAuthenticated } = useAuthStore();

	const role = user?.type ?? 'User';
	const roleStyle = ROLE_COLORS[role] ?? ROLE_COLORS.User;

	const initials = user?.name
		? user.name
			.split(' ')
			.slice(0, 2)
			.map((n) => n[0])
			.join('')
			.toUpperCase()
		: '?';

	return (
		<ScrollView
			style={styles.scroll}
			contentContainerStyle={styles.content}
			showsVerticalScrollIndicator={false}
		>
			{/* Hero Greeting Card */}
			<View style={styles.heroCard}>
				<View style={styles.heroLeft}>
					<Text style={styles.greeting}>
						{isAuthenticated ? '¡Bienvenido de vuelta!' : 'Bienvenido'}
					</Text>
					<Text style={styles.userName} numberOfLines={1}>
						{isAuthenticated && user ? user.name.split(' ')[0] : 'Invitado'}
					</Text>
					{isAuthenticated && user?.company_name ? (
						<Text style={styles.companyName} numberOfLines={1}>
							{user.company_name}
						</Text>
					) : null}
					{isAuthenticated ? (
						<View style={[styles.roleBadge, { backgroundColor: roleStyle.bg }]}>
							<Text style={[styles.roleText, { color: roleStyle.text }]}>
								{ROLE_LABELS[role]}
							</Text>
						</View>
					) : null}
				</View>

				{/* Avatar / initials */}
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>{initials}</Text>
				</View>

				{/* Background blobs */}
				<View style={styles.heroBlobTop} pointerEvents="none" />
				<View style={styles.heroBlobBottom} pointerEvents="none" />
			</View>

			{/* Quick actions */}
			<QuickMenu quickActions={quickActionsHome} type="quick" />
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
	heroCard: {
		backgroundColor: '#07174c',
		borderRadius: 24,
		padding: 22,
		marginBottom: 28,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		overflow: 'hidden',
		shadowColor: '#07174c',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.35,
		shadowRadius: 18,
		elevation: 10,
	},
	heroLeft: {
		flex: 1,
		paddingRight: 12,
	},
	greeting: {
		fontFamily: 'Inter-Regular',
		fontSize: 13,
		color: 'rgba(191,219,254,0.8)',
		marginBottom: 4,
	},
	userName: {
		fontFamily: 'Inter-Bold',
		fontSize: 22,
		color: '#ffffff',
		marginBottom: 4,
	},
	companyName: {
		fontFamily: 'Inter-Medium',
		fontSize: 13,
		color: 'rgba(148,163,184,0.9)',
		marginBottom: 10,
	},
	roleBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
		marginTop: 4,
	},
	roleText: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 11,
		letterSpacing: 0.3,
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 18,
		backgroundColor: 'rgba(59,130,246,0.25)',
		borderWidth: 1.5,
		borderColor: 'rgba(96,165,250,0.4)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		fontFamily: 'Inter-Bold',
		fontSize: 18,
		color: '#93c5fd',
	},
	heroBlobTop: {
		position: 'absolute',
		top: -30,
		right: -30,
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: 'rgba(59,130,246,0.12)',
	},
	heroBlobBottom: {
		position: 'absolute',
		bottom: -40,
		right: 30,
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: 'rgba(96,165,250,0.08)',
	},
});
