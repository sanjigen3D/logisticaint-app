import { useAuth } from '@/lib/hooks/useAuth';
import { useTabBar } from '@/lib/hooks/useTabBar';
import { Tabs, usePathname } from 'expo-router';
import { Home, LogIn, ShieldAlert, User } from 'lucide-react-native';
import { View } from 'react-native';

export default function AccountsLayout() {
	const pathname = usePathname();
	const { isAuthenticated } = useAuth();
	const { screenOptions, styles } = useTabBar();

	const isInAdmin = pathname.startsWith('/(admin)') || pathname.startsWith('/admin');

	return (
		<Tabs screenOptions={screenOptions}>
			<Tabs.Screen
				name="toHome"
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
				name="toAdmin"
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

