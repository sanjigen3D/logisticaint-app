import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ExternalPathString, RelativePathString, router } from 'expo-router';
import { quickActions } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { LogOut, User as UserIcon, Mail, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AccountHomeScreen() {
	const { isAuthenticated, user, logout, isAdmin, isManager } = useAuth();

	const handleQuickAction = (
		route: ExternalPathString | RelativePathString,
	) => {
		router.push(route);
	};

	const handleLogout = async () => {
		await logout();
		router.replace('/');
	};

	if (isAuthenticated && user) {
		return (
			<View style={styles.accountContainer}>
				<View style={styles.profileCard}>
					<View style={styles.profileHeader}>
						<View style={styles.avatarContainer}>
							<UserIcon size={48} color="#ffffff" />
						</View>
						<View style={styles.profileInfo}>
							<Text style={styles.profileName}>{user.name}</Text>
							<View style={styles.profileEmailContainer}>
								<Mail size={16} color="#64748b" />
								<Text style={styles.profileEmail}>{user.email}</Text>
							</View>
						</View>
					</View>

					<View style={styles.roleContainer}>
						<Shield size={16} color="#3b82f6" />
						<Text style={styles.roleText}>Rol: {user.type}</Text>
					</View>

					{(isAdmin || isManager) && (
						<View style={styles.permissionsContainer}>
							<Text style={styles.permissionsTitle}>Permisos especiales</Text>
							<Text style={styles.permissionsText}>
								{isAdmin
									? 'Tienes acceso completo de administrador'
									: 'Tienes permisos de gestión'}
							</Text>
						</View>
					)}

					<TouchableOpacity
						style={styles.logoutButton}
						onPress={handleLogout}
						activeOpacity={0.8}
					>
						<LinearGradient
							colors={['#ef4444', '#dc2626']}
							style={styles.logoutButtonGradient}
						>
							<LogOut size={20} color="#ffffff" />
							<Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.accountContainer}>
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
		</View>
	);
}

const styles = StyleSheet.create({
	accountContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	profileCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 24,
		marginTop: 20,
		boxShadow: '0px 2px 8px rgba(0,0,0, 0.1)',
	},
	profileHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 24,
	},
	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#3b82f6',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	profileInfo: {
		flex: 1,
	},
	profileName: {
		fontSize: 24,
		fontFamily: 'Inter-Bold',
		color: '#1e293b',
		marginBottom: 8,
	},
	profileEmailContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	profileEmail: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginLeft: 8,
	},
	roleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#eff6ff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	roleText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#1e40af',
		marginLeft: 8,
	},
	permissionsContainer: {
		backgroundColor: '#f0fdf4',
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: '#bbf7d0',
	},
	permissionsTitle: {
		fontSize: 14,
		fontFamily: 'Inter-SemiBold',
		color: '#15803d',
		marginBottom: 4,
	},
	permissionsText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#16a34a',
	},
	logoutButton: {
		borderRadius: 12,
		overflow: 'hidden',
	},
	logoutButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	logoutButtonText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
		marginLeft: 8,
	},
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
