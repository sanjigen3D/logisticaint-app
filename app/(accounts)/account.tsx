import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { quickActionLogOut, quickActionsAccount } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/stores/authStore';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const ROLE_LABELS: Record<string, string> = {
	Admin: 'Administrador',
	Manager: 'Gerente',
	User: 'Usuario',
};

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
	Admin: { bg: '#ede9fe', text: '#6d28d9', border: '#c4b5fd' },
	Manager: { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
	User: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
};

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export default function AccountHomeScreen() {
	const { isAuthenticated, isManagerOrHigher } = useAuth();
	const { user } = useAuthStore();

	const currentActions = isAuthenticated
		? quickActionsAccount.map((action) =>
			action.title === 'Iniciar Sesión' ? quickActionLogOut[0] : action,
		)
		: quickActionsAccount;

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
			{/* Profile card — only when authenticated */}
			{isAuthenticated && user ? (
				<View style={styles.profileCard}>
					<View style={styles.blobTR} pointerEvents="none" />
					<View style={styles.blobBL} pointerEvents="none" />

					<View style={styles.profileRow}>
						<View style={styles.avatarWrap}>
							<Text style={styles.avatarText}>{initials}</Text>
						</View>
						<View style={styles.profileInfo}>
							<Text style={styles.profileName} numberOfLines={1}>{user.name}</Text>
							<Text style={styles.profileEmail} numberOfLines={1}>{user.email}</Text>
							{user.company_name ? (
								<Text style={styles.profileCompany} numberOfLines={1}>
									{user.company_name}
								</Text>
							) : null}
						</View>
					</View>

					<View
						style={[
							styles.roleBadge,
							{ backgroundColor: roleStyle.bg, borderColor: roleStyle.border },
						]}
					>
						<View style={[styles.roleDot, { backgroundColor: roleStyle.text }]} />
						<Text style={[styles.roleText, { color: roleStyle.text }]}>
							{ROLE_LABELS[role] ?? role}
						</Text>
					</View>
				</View>
			) : null}

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
	profileCard: {
		backgroundColor: '#0f2d6b', // Matches lighter part of navbar gradient
		borderRadius: 24,
		padding: 22,
		marginBottom: 28,
		overflow: 'hidden',
		shadowColor: '#0f2d6b',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.35,
		shadowRadius: 18,
		elevation: 10,
	},
	blobTR: {
		position: 'absolute',
		top: -24,
		right: -24,
		width: 90,
		height: 90,
		borderRadius: 45,
		backgroundColor: 'rgba(59,130,246,0.15)',
	},
	blobBL: {
		position: 'absolute',
		bottom: -20,
		left: 10,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(96,165,250,0.08)',
	},
	profileRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 14,
		gap: 16,
	},
	avatarWrap: {
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
		fontSize: 20,
		color: '#93c5fd',
	},
	profileInfo: {
		flex: 1,
	},
	profileName: {
		fontFamily: 'Inter-Bold',
		fontSize: 17,
		color: '#ffffff',
		marginBottom: 2,
	},
	profileEmail: {
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		color: 'rgba(148,163,184,0.9)',
		marginBottom: 2,
	},
	profileCompany: {
		fontFamily: 'Inter-Medium',
		fontSize: 12,
		color: 'rgba(191,219,254,0.8)',
	},
	roleBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderRadius: 20,
		borderWidth: 1,
		gap: 6,
	},
	roleDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
	},
	roleText: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 12,
		letterSpacing: 0.3,
	},
});
