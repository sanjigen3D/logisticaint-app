import { Tabs, Stack } from 'expo-router';
import { Platform } from 'react-native';
import { Package, Search } from 'lucide-react-native';

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
					title: 'Track',
					tabBarIcon: ({ size, color }) => (
						<Package size={size} color={color} />
					),
				}}
			/>
			{/* oculta en el menu */}
			<Tabs.Screen name="results" options={{ href: null }} />
		</Tabs>
	);
}
