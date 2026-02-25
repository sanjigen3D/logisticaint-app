import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { quickActionsAdmin } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { Redirect, useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export default function AdminScreen() {
    const { isManagerOrHigher } = useAuth();
    const { showToast } = useToastStore();
    const router = useRouter();

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
            {/* Header accent card */}
            <View style={styles.headerCard}>
                <View style={styles.blobRight} pointerEvents="none" />
                <View style={styles.blobLeft} pointerEvents="none" />

                <View style={styles.headerIconWrap}>
                    <Shield size={22} color="#a78bfa" strokeWidth={2} />
                </View>
                <Text style={styles.headerTitle}>Panel de Administración</Text>
                <Text style={styles.headerSubtitle}>
                    Gestiona usuarios, empresas y contactos desde aquí
                </Text>
            </View>

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
    headerCard: {
        backgroundColor: '#1e1b4b',
        borderRadius: 24,
        padding: 22,
        marginBottom: 28,
        overflow: 'hidden',
        shadowColor: '#4c1d95',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 10,
    },
    blobRight: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(124,58,237,0.2)',
    },
    blobLeft: {
        position: 'absolute',
        bottom: -30,
        left: 20,
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(139,92,246,0.12)',
    },
    headerIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(124,58,237,0.25)',
        borderWidth: 1,
        borderColor: 'rgba(167,139,250,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    headerTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#ffffff',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    headerSubtitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        color: 'rgba(196,181,253,0.8)',
        lineHeight: 18,
    },
});
