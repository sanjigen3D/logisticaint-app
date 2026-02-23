import { ROUTES } from '@/lib/Routes';
import { Tabs, usePathname } from 'expo-router';
import { Home, LogIn, User, UserPlus } from 'lucide-react-native';

export default function TabLayout() {
	const pathname = usePathname();

	const isAccount = pathname === ROUTES.ACCOUNT;
	const isLogin = pathname === ROUTES.LOGIN;
	const isRegister = pathname === ROUTES.REGISTER;

	return (
		<>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: '#1e40af',
					tabBarInactiveTintColor: '#64748b',
					tabBarStyle: {
						backgroundColor: '#fff',
						borderTopWidth: 1,
						borderTopColor: '#e2e8f0',
						paddingBottom: 20,
						paddingTop: 10,
						height: 90,
					},
					tabBarLabelStyle: {
						fontSize: 12,
						fontFamily: 'Inter-Medium',
						marginTop: 4,
					},
				}}
			>
				<Tabs.Screen
					name="backToHome"
					options={{
						title: 'Home',
						tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="account"
					options={
						isAccount
							? { href: null }
							: {
								title: 'Cuenta',
								tabBarIcon: ({ size, color }) => (
									<User size={size} color={color} />
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
								tabBarIcon: ({ size, color }) => (
									<LogIn size={size} color={color} />
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
								title: 'Solicitar Cuenta',
								tabBarIcon: ({ size, color }) => (
									<UserPlus size={size} color={color} />
								),
							}
					}
				/>
			</Tabs>
		</>
	);
}
