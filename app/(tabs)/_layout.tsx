import { Tabs } from 'expo-router';
import { Package, Search, User } from 'lucide-react-native';

export default function TabLayout() {
	return (
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
				name="index"
				options={{
					title: 'Buscar Itinerario',
					tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="track"
				options={{
					title: 'Seguimiento',
					tabBarIcon: ({ size, color }) => (
						<Package size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="account-dummy"
				options={{
					title: 'Cuenta',
					tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
				}}
			/>
			{/* oculta en el menu */}
			{/*<Tabs.Screen name="results" options={{ href: null }} />*/}
		</Tabs>
	);
}
