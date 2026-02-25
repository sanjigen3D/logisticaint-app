import { ROUTES } from '@/lib/Routes';
import { Tabs, usePathname } from 'expo-router';
import { Home, ShieldAlert, User } from 'lucide-react-native';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

const GLASS_BG = 'rgba(7,23,76,0.72)';
const GLASS_BORDER = 'rgba(96,165,250,0.22)';

export default function AdminLayout() {
    const pathname = usePathname();
    const { width } = useWindowDimensions();

    const BAR_MAX_WIDTH = 400;
    const barWidth = Math.min(width * 0.9, BAR_MAX_WIDTH);
    const barOffset = (width - barWidth) / 2;
    const showLabels = width >= 480;
    const barHeight = showLabels ? 72 : 58;

    const isAdminMain = pathname === ROUTES.ADMIN || pathname === '/(admin)/admin';

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
                name="homeDummy"
                options={{
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
                }}
            />
            <Tabs.Screen
                name="accountDummy"
                options={{
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
                }}
            />

            <Tabs.Screen
                name="admin"
                options={
                    {
                        title: 'Admin',
                        tabBarIcon: ({ size, color }) => (
                            <View style={styles.iconWrap}>
                                <ShieldAlert
                                    size={size}
                                    color={color}
                                    strokeWidth={2.4}
                                />
                            </View>
                        ),
                    }
                }
            />

            <Tabs.Screen name="create-user" options={{ href: null }} />
            <Tabs.Screen name="create-company" options={{ href: null }} />
            <Tabs.Screen name="create-contact" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarGlass: {
        flex: 1,
        borderRadius: 28,
        overflow: 'hidden',
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
