import { useTabBar } from '@/lib/hooks/useTabBar';
import { ROUTES } from '@/lib/Routes';
import { Tabs, usePathname } from 'expo-router';
import { Home, ShieldAlert, User } from 'lucide-react-native';
import { View } from 'react-native';

export default function AdminLayout() {
    const pathname = usePathname();
    const { screenOptions, styles } = useTabBar();

    const isAdminMain = pathname === ROUTES.ADMIN || pathname === '/(admin)/admin';

    return (
        <Tabs screenOptions={screenOptions}>
            <Tabs.Screen
                name="toHome"
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
                name="toAccount"
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
            <Tabs.Screen name="users" options={{ href: null }} />
            <Tabs.Screen name="companies" options={{ href: null }} />
            <Tabs.Screen name="contacts" options={{ href: null }} />
        </Tabs>
    );
}
