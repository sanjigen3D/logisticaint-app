import { ROUTES } from '@/lib/Routes';
import { Tabs, usePathname } from 'expo-router';
import { Home, ShieldAlert, User } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';

const GLASS_BG = 'rgba(7,23,76,0.72)';
const GLASS_BORDER = 'rgba(96,165,250,0.22)';

export default function AdminLayout() {
    const pathname = usePathname();
    const isAdminMain = pathname === ROUTES.ADMIN || pathname === '/(admin)';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#93c5fd',
                tabBarInactiveTintColor: '#e2e8f0', // Lighter for better contrast
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 28 : 16,
                    left: 20,
                    right: 20,
                    backgroundColor: GLASS_BG,
                    borderRadius: 28,
                    borderWidth: 1,
                    borderColor: GLASS_BORDER,
                    height: 68,
                    paddingBottom: 0,
                    paddingTop: 0,
                    elevation: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 24,
                    maxWidth: 400,
                    alignSelf: 'center',
                    width: '100%',
                },
                tabBarItemStyle: {
                    paddingVertical: 10,
                    borderRadius: 20,
                    marginHorizontal: 2,
                },
                tabBarLabelStyle: {
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
                    tabBarIcon: ({ size, color, focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <Home
                                size={focused ? size : size - 2}
                                color={color}
                                strokeWidth={focused ? 2.4 : 1.8}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="accountDummy"
                options={{
                    title: 'Cuenta',
                    tabBarIcon: ({ size, color, focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <User
                                size={focused ? size : size - 2}
                                color={color}
                                strokeWidth={focused ? 2.4 : 1.8}
                            />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="admin"
                options={
                    !isAdminMain
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
