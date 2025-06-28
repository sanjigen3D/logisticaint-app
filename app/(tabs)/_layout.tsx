import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Search, Package, History, User } from 'lucide-react-native';

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
					paddingBottom: Platform.OS === 'ios' ? 20 : 10,
					paddingTop: 10,
					height: Platform.OS === 'ios' ? 90 : 70,
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
			{/* oculta en el menu */}
			<Tabs.Screen name={'results'} options={{ href: null }} />
		</Tabs>
	);
}
