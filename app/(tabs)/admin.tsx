import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { quickActionsAdmin } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToastStore } from '@/lib/stores/useToastStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

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
            router.replace('/(tabs)');
        }
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Panel de Administración</Text>
            <Text style={styles.subtitle}>Selecciona una acción para continuar</Text>
            <QuickMenu quickActions={quickActionsAdmin} type="quick" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        maxWidth: 1024,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#1e293b',
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#64748b',
        marginBottom: 24,
    },
});
