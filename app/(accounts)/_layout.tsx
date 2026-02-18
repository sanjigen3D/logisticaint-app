import { Tabs } from 'expo-router';
import { Home, UserPlus, LogIn } from 'lucide-react-native';

export default function TabLayout() {
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
					name="login"
					options={{
						title: 'Ingresar',
						tabBarIcon: ({ size, color }) => (
							<LogIn size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="register"
					options={{
						title: 'Solicitar Cuenta',
						tabBarIcon: ({ size, color }) => (
							<UserPlus size={size} color={color} />
						),
					}}
				/>

				{/* oculta en el menu */}
				<Tabs.Screen name="account" options={{ href: null }} />
			</Tabs>
		</>
	);
}
