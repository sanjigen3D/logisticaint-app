import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import UserProfileCard from '@/components/UI/UserProfileCard';
import { quickActionsAdmin } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export default function AdminScreen() {
    const { isManagerOrHigher } = useAuth();
    const { showToast } = useToastStore();

    useEffect(() => {
        if (!isManagerOrHigher()) {
            showToast({
                type: 'error',
                message: 'Acceso restringido',
                description: 'No tienes permisos para acceder a esta sección.',
            });
        }
    }, [isManagerOrHigher, showToast]);

    if (!isManagerOrHigher()) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <UserProfileCard />
            <QuickMenu quickActions={quickActionsAdmin} type="admin" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    content: {
        width: '100%',
        maxWidth: 1024,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: TAB_BAR_HEIGHT,
    },
});
