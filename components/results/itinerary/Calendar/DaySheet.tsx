import { UnifiedRoute } from '@/lib/types/unifiedInterfaces';
import { Ship, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import ResultCard from '../ResultCard';

interface DaySheetProps {
    selectedDate: string | null;
    routes: UnifiedRoute[];
    onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;

export default function DaySheet({ selectedDate, routes, onClose }: DaySheetProps) {
    const translateY = useRef(new Animated.Value(SHEET_MAX_HEIGHT)).current;
    const visible = selectedDate !== null;

    // Slide in when opening, slide out when closing
    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                stiffness: 200,
            }).start();
        } else {
            translateY.setValue(SHEET_MAX_HEIGHT);
        }
    }, [visible, translateY]);

    const handleClose = useCallback(() => {
        Animated.timing(translateY, {
            toValue: SHEET_MAX_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => onClose());
    }, [translateY, onClose]);

    // Swipe down to close (mobile only)
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, { dy }) => dy > 10,
            onPanResponderMove: (_, { dy }) => {
                if (dy > 0) translateY.setValue(dy);
            },
            onPanResponderRelease: (_, { dy, vy }) => {
                if (dy > 80 || vy > 0.8) {
                    handleClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        damping: 20,
                        stiffness: 300,
                    }).start();
                }
            },
        })
    ).current;

    if (!selectedDate) return null;

    const formattedDate = selectedDate.split('-').reverse().join('/');

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            {/* Overlay */}
            <Pressable style={styles.overlay} onPress={handleClose} />

            {/* Sheet */}
            <Animated.View
                style={[
                    styles.sheet,
                    { transform: [{ translateY }] },
                    Platform.OS === 'web' && styles.sheetWeb,
                ]}
            >
                {/* Drag handle — mobile only */}
                {Platform.OS !== 'web' && (
                    <View style={styles.handleArea} {...panResponder.panHandlers}>
                        <View style={styles.handle} />
                    </View>
                )}

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Salidas — {formattedDate}</Text>
                        <Text style={styles.badge}>
                            {routes.length} {routes.length === 1 ? 'viaje' : 'viajes'}
                        </Text>
                    </View>
                    <Pressable
                        onPress={handleClose}
                        style={({ pressed }) => [
                            styles.closeBtn,
                            pressed && { opacity: 0.6 },
                            Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                        ]}
                    >
                        <X size={18} color="#64748b" />
                    </Pressable>
                </View>

                {/* Content */}
                {routes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ship size={44} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No hay salidas para este día</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    >
                        {routes.map((route, idx) => (
                            <ResultCard key={route.id || idx} route={route} />
                        ))}
                    </ScrollView>
                )}
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15,23,42,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: SHEET_MAX_HEIGHT,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 20,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    },
    sheetWeb: {
        // On web: center it as a floating modal instead
        position: 'absolute' as const,
        bottom: undefined,
        top: '50%',
        left: '50%',
        right: undefined,
        // @ts-ignore — valid in RN Web
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        width: '90%',
        maxWidth: 600,
        borderRadius: 24,
    },
    handleArea: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#cbd5e1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'web' ? 20 : 4,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#f1f5f9',
    },
    title: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 17,
        color: '#0f172a',
        marginBottom: 3,
    },
    badge: {
        fontFamily: 'Inter-Medium',
        fontSize: 13,
        color: '#4338ca',
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flexShrink: 1,
    },
    list: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        gap: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        gap: 12,
    },
    emptyText: {
        fontFamily: 'Inter-Medium',
        fontSize: 15,
        color: '#94a3b8',
    },
});
