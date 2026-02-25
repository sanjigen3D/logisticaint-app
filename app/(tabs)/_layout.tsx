import { ROUTES } from '@/lib/Routes';
import { Tabs, usePathname } from 'expo-router';
import { Home, Package, Search, User } from 'lucide-react-native';

export default function TabLayout() {
	const pathname = usePathname();

	const isHome = pathname === ROUTES.HOME;
	const isItinerary = pathname === ROUTES.ITINERARY;
	const isTrack = pathname === ROUTES.TRACKING;
	const isAccount = pathname === ROUTES.ACCOUNT;

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
				options={
					isHome
						? { href: null }
						: {
							title: 'Home',
							tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
						}
				}
			/>
			<Tabs.Screen
				name="itinerary"
				options={
					isItinerary
						? { href: null }
						: {
							title: 'Buscar Itinerario',
							tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
						}
				}
			/>
			<Tabs.Screen
				name="track"
				options={
					isTrack
						? { href: null }
						: {
							title: 'Seguimiento',
							tabBarIcon: ({ size, color }) => (
								<Package size={size} color={color} />
							),
						}
				}
			/>
			<Tabs.Screen
				name="account"
				options={
					isAccount
						? { href: null }
						: {
							title: 'Cuenta',
							tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
						}
				}
			/>

			<Tabs.Screen
				name="admin"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="admin/create-user"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="admin/create-company"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="admin/create-contact"
				options={{ href: null }}
			/>
		</Tabs>
	);
}
