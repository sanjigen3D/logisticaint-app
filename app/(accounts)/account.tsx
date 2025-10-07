import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from 'react-native';
import { ExternalPathString, RelativePathString, router } from 'expo-router';
import { quickActions } from '@/lib/constants';

export default function AccountHomeScreen() {
	const handleQuickAction = (
		route: ExternalPathString | RelativePathString,
	) => {
		router.push(route);
	};

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Main Content Container */}
				<View style={styles.mainContainer}>
					{/* Quick Actions */}
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
									<Text style={styles.quickActionSubtitle}>
										{action.subtitle}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	header: {
		paddingTop: Platform.OS === 'ios' ? 60 : 40,
		paddingBottom: 40,
	},
	headerContainer: {
		width: '100%',
		maxWidth: 1200,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	headerContent: {
		alignItems: 'center',
	},
	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
	},
	headerTitle: {
		fontSize: 28,
		fontFamily: 'Inter-Bold',
		color: '#ffffff',
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#e9d5ff',
		textAlign: 'center',
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 800,
		alignSelf: 'center',
		paddingHorizontal: 20,
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
	featuresContainer: {
		marginBottom: 24,
	},
	featuresTitle: {
		fontSize: 20,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 8,
	},
	featuresSubtitle: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginBottom: 16,
	},
	featureCard: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
		boxShadow: '0px 1px 2px rgba(0,0,0, 0.05)',
	},
	featureIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	featureContent: {
		flex: 1,
	},
	featureTitle: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 2,
	},
	featureDescription: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	infoContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 20,
		boxShadow: '0px 2px 8px rgba(0,0,0, 0.1)',
	},
	infoTitle: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
	},
	benefitsList: {
		gap: 8,
	},
	benefitItem: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		lineHeight: 20,
	},
});
