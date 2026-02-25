import { ROUTES } from '@/lib/Routes';
import { useAuth } from '@/lib/hooks/useAuth';
import { Tabs, usePathname } from 'expo-router';
import { Home, LogIn, ShieldAlert, User } from 'lucide-react-native';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

// Matches the design of the main (tabs) layout
const COLORS = {
	tabBg: 'rgba(7,23,76,0.72)',
	tabBorder: 'rgba(96,165,250,0.25)',
	active: '#60a5fa',
	inactive: '#e2e8f0', // Lighter for better contrast
};

export default function AccountsLayout() {
	const pathname = usePathname();
	const { width } = useWindowDimensions();
	const { isAuthenticated } = useAuth();

	const BAR_MAX_WIDTH = 400;
	const barWidth = Math.min(width * 0.9, BAR_MAX_WIDTH);
	const barOffset = (width - barWidth) / 2;
	const showLabels = width >= 480;
	const barHeight = showLabels ? 72 : 58;

	const isAccount = pathname === ROUTES.ACCOUNT;
	const isInAdmin = pathname.startsWith('/(admin)') || pathname.startsWith('/admin');

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: showLabels,
				tabBarActiveTintColor: COLORS.active,
				tabBarInactiveTintColor: COLORS.inactive,
				tabBarStyle: {
					position: 'absolute',
					bottom: Platform.OS === 'ios' ? 28 : Platform.OS === 'web' ? 36 : 16,
					left: barOffset,
					right: barOffset,
					width: barWidth,
					backgroundColor: COLORS.tabBg,
					borderRadius: 28,
					borderWidth: 1,
					borderColor: COLORS.tabBorder,
					height: barHeight,
					paddingBottom: showLabels ? 6 : 0,
					paddingTop: showLabels ? 2 : 0,
					elevation: 20,
					shadowColor: '#07174c',
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.55,
					shadowRadius: 20,
				},
				tabBarItemStyle: {
					paddingVertical: 10,
					borderRadius: 20,
				},
				tabBarLabelStyle: {
					display: showLabels ? 'flex' : 'none',
					fontSize: 11,
					fontFamily: 'Inter-Medium',
					marginTop: 2,
					letterSpacing: 0.3,
				},
				tabBarBackground: () => (
					<View style={styles.tabBarBackground} />
				),
			}}
		>
			<Tabs.Screen
				name="backToHome"
				options={{
					title: 'Inicio',
					tabBarIcon: ({ size, color }) => (
						<View style={styles.iconWrap}>
							<Home size={size} color={color} strokeWidth={2.4} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={
					{
						title: 'Mi Cuenta',
						tabBarIcon: ({ size, color }) => (
							<View style={styles.iconWrap}>
								<User size={size} color={color} strokeWidth={2.4} />
							</View>
						),
					}
				}
			/>
			<Tabs.Screen
				name="login"
				options={
					isAuthenticated
						? { href: null }
						: {
							title: 'Ingresar',
							tabBarIcon: ({ size, color }) => (
								<View style={styles.iconWrap}>
									<LogIn size={size} color={color} strokeWidth={2.4} />
								</View>
							),
						}
				}
			/>
			<Tabs.Screen
				name="register"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="adminDummy"
				options={
					!isAuthenticated || isInAdmin
						? { href: null }
						: {
							title: 'Admin',
							tabBarIcon: ({ size, color }) => (
								<View style={styles.iconWrap}>
									<ShieldAlert size={size} color={color} strokeWidth={2.4} />
								</View>
							),
						}
				}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBarBackground: {
		flex: 1,
		borderRadius: 28,
		overflow: 'hidden',
		backgroundColor: 'rgba(7,23,76,0.72)',
	},
	iconWrap: {
		width: 36,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 14,
	},
	iconWrapActive: {
		backgroundColor: 'rgba(59,130,246,0.18)',
	},
});
