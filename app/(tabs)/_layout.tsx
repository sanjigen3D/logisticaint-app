import { useAuth } from '@/lib/hooks/useAuth';
import { Tabs, usePathname } from 'expo-router';
import { Home, LogIn, ShieldAlert, User } from 'lucide-react-native';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

// Frosted glass colors — semi-transparent dark navy
const GLASS_BG = 'rgba(7,23,76,0.72)';
const GLASS_BORDER = 'rgba(96,165,250,0.22)';

export default function TabLayout() {
	const pathname = usePathname();
	const { width } = useWindowDimensions();
	const { isAuthenticated } = useAuth();

	const BAR_MAX_WIDTH = 400;
	const barWidth = Math.min(width * 0.9, BAR_MAX_WIDTH);
	const barOffset = (width - barWidth) / 2;
	const showLabels = width >= 480;
	const barHeight = showLabels ? 72 : 58;

	const isInAdmin = pathname.startsWith('/(admin)') || pathname.startsWith('/admin');

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: showLabels,
				tabBarActiveTintColor: '#93c5fd',
				tabBarInactiveTintColor: '#e2e8f0', // Lighter for better contrast
				tabBarStyle: {
					position: 'absolute',
					bottom: Platform.OS === 'ios' ? 28 : Platform.OS === 'web' ? 36 : 16,
					left: barOffset,
					right: barOffset,
					width: barWidth,
					// Frosted glass effect
					backgroundColor: GLASS_BG,
					borderRadius: 28,
					borderWidth: 1,
					borderColor: GLASS_BORDER,
					height: barHeight,
					paddingBottom: showLabels ? 6 : 0,
					paddingTop: showLabels ? 2 : 0,
					elevation: 24,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 12 },
					shadowOpacity: 0.4,
					shadowRadius: 24,
				},
				tabBarItemStyle: {
					paddingVertical: 10,
					borderRadius: 20,
					marginHorizontal: 2,
				},
				tabBarLabelStyle: {
					display: showLabels ? 'flex' : 'none',
					fontSize: 10,
					fontFamily: 'Inter-Medium',
					marginTop: 2,
					letterSpacing: 0.3,
				},
				tabBarBackground: () => <View style={styles.tabBarGlass} />,
			}}
		>
			<Tabs.Screen
				name="index"
				options={
					{
						title: 'Inicio',
						tabBarIcon: ({ size, color }) => (
							<View style={styles.iconWrap}>
								<Home
									size={size}
									color={color}
									strokeWidth={2.4}
								/>
							</View>
						),
					}
				}
			/>
			<Tabs.Screen
				name="itinerary"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="track"
				options={{ href: null }}
			/>
			<Tabs.Screen
				name="account"
				options={
					{
						title: 'Cuenta',
						tabBarIcon: ({ size, color }) => (
							<View style={styles.iconWrap}>
								<User
									size={size}
									color={color}
									strokeWidth={2.4}
								/>
							</View>
						),
					}
				}
			/>

			<Tabs.Screen
				name="admin"
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

			<Tabs.Screen
				name="toLogin"
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

			<Tabs.Screen name="itineraries/index" options={{ href: null }} />
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBarGlass: {
		flex: 1,
		borderRadius: 28,
		backgroundColor: GLASS_BG,
	},
	iconWrap: {
		width: 38,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 14,
	},
	iconWrapActive: {
		backgroundColor: 'rgba(59,130,246,0.2)',
	},
});
