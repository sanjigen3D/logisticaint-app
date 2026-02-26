import { X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;

interface AdaptiveModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function AdaptiveModal({ visible, onClose, title, children }: AdaptiveModalProps) {
    const translateY = useRef(new Animated.Value(SHEET_MAX_HEIGHT)).current;

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
        if (!visible) return;

        Animated.timing(translateY, {
            toValue: SHEET_MAX_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    }, [translateY, onClose, visible]);

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

    // Do not render anything when invisible so we don't block the screen
    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
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
                        <Text style={styles.title}>{title}</Text>
                        <Pressable
                            onPress={handleClose}
                            style={({ pressed }) => [
                                styles.closeBtn,
                                pressed && { opacity: 0.6 },
                                Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                            ]}
                            hitSlop={10}
                        >
                            <X size={20} color="#64748b" />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15,23,42,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%', // Taking up to 80% on mobile
        maxHeight: SHEET_MAX_HEIGHT,
        backgroundColor: '#f8fafc',
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
        position: 'relative' as any,
        alignSelf: 'center',
        height: 'auto',
        maxHeight: '90%',
        width: '90%',
        maxWidth: 600,
        borderRadius: 24,
        paddingBottom: 24,
    },
    handleArea: {
        paddingVertical: 12,
        alignItems: 'center',
        width: '100%',
    },
    handle: {
        width: 48,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#cbd5e1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'web' ? 24 : 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: '#0f172a',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
});
