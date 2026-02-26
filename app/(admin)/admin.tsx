import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import UserProfileCard from '@/components/UI/UserProfileCard';
import {
    quickActionsAdminCompanies,
    quickActionsAdminContacts,
    quickActionsAdminUsers
} from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

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

            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Panel de Administración</Text>
                <Text style={styles.headerSubtitle}>Selecciona una acción para comenzar</Text>
            </View>

            <QuickMenu
                quickActions={quickActionsAdminUsers}
                type="admin"
                title="Usuarios"
                accentColor="#7c3aed"
            />

            <QuickMenu
                quickActions={quickActionsAdminCompanies}
                type="admin"
                title="Empresas"
                accentColor="#059669"
            />

            <QuickMenu
                quickActions={quickActionsAdminContacts}
                type="admin"
                title="Contactos"
                accentColor="#0284c7"
            />
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
    headerContainer: {
        marginBottom: 24,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Inter-Bold',
        color: '#0f172a',
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#64748b',
        marginTop: 4,
    },
});
