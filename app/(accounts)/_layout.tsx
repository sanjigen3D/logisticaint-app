import { ROUTES } from '@/lib/Routes';
import { Tabs, usePathname } from 'expo-router';
import { Home, LogIn, ShieldAlert, User, UserPlus } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';

// Matches the design of the main (tabs) layout
const COLORS = {
	tabBg: 'rgba(7,23,76,0.72)',
	tabBorder: 'rgba(96,165,250,0.25)',
	active: '#60a5fa',
	inactive: '#e2e8f0', // Lighter for better contrast
};

export default function AccountsLayout() {
	const pathname = usePathname();

	const isAccount = pathname === ROUTES.ACCOUNT;
	const isLogin = pathname === ROUTES.LOGIN;
	const isRegister = pathname === ROUTES.REGISTER;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: COLORS.active,
				tabBarInactiveTintColor: COLORS.inactive,
				tabBarStyle: {
					position: 'absolute',
					bottom: Platform.OS === 'ios' ? 28 : 16,
					left: 20,
					right: 20,
					backgroundColor: COLORS.tabBg,
					borderRadius: 28,
					borderWidth: 1,
					borderColor: COLORS.tabBorder,
					height: 68,
					paddingBottom: 0,
					paddingTop: 0,
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
					tabBarIcon: ({ size, color, focused }) => (
						<View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
							<Home size={focused ? size : size - 2} color={color} strokeWidth={focused ? 2.4 : 1.8} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={
					isAccount
						? { href: null }
						: {
							title: 'Mi Cuenta',
							tabBarIcon: ({ size, color, focused }) => (
								<View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
									<User size={focused ? size : size - 2} color={color} strokeWidth={focused ? 2.4 : 1.8} />
								</View>
							),
						}
				}
			/>
			<Tabs.Screen
				name="login"
				options={
					isLogin
						? { href: null }
						: {
							title: 'Ingresar',
							tabBarIcon: ({ size, color, focused }) => (
								<View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
									<LogIn size={focused ? size : size - 2} color={color} strokeWidth={focused ? 2.4 : 1.8} />
								</View>
							),
						}
				}
			/>
			<Tabs.Screen
				name="register"
				options={
					isRegister
						? { href: null }
						: {
							title: 'Registrarse',
							tabBarIcon: ({ size, color, focused }) => (
								<View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
									<UserPlus size={focused ? size : size - 2} color={color} strokeWidth={focused ? 2.4 : 1.8} />
								</View>
							),
						}
				}
			/>
			<Tabs.Screen
				name="adminDummy"
				options={
					pathname.startsWith('/(admin)') || pathname.startsWith('/admin')
						? { href: null }
						: {
							title: 'Admin',
							tabBarIcon: ({ size, color, focused }) => (
								<View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
									<ShieldAlert
										size={focused ? size : size - 2}
										color={color}
										strokeWidth={focused ? 2.4 : 1.8}
									/>
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
