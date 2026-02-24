import { useToastStore } from '@/lib/stores/useToastStore';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

export const GlobalToast = () => {
    const { visible, message, description, type, hideToast } = useToastStore();
    const isWeb = Platform.OS === 'web';
    const translateY = useRef(new Animated.Value(isWeb ? 250 : -150)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: isWeb ? -20 : (Platform.OS === 'ios' ? 60 : 40),
                useNativeDriver: !isWeb,
                speed: 12,
                bounciness: 4,
            }).start();

            const timer = setTimeout(() => {
                hideToast();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            Animated.timing(translateY, {
                toValue: isWeb ? 250 : -150,
                duration: 250,
                useNativeDriver: !isWeb,
            }).start();
        }
    }, [visible, translateY, hideToast, isWeb]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle color="#10b981" size={24} />;
            case 'error':
                return <AlertCircle color="#ef4444" size={24} />;
            default:
                return <Info color="#3b82f6" size={24} />;
        }
    };

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                { transform: [{ translateY }] },
                type === 'success' && { borderLeftColor: '#10b981' },
                type === 'error' && { borderLeftColor: '#ef4444' },
            ]}
            pointerEvents={visible ? "auto" : "none"}
        >
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>{getIcon()}</View>
                <View style={styles.textContainer}>
                    <Text style={styles.messageText}>{message}</Text>
                    {description ? <Text style={styles.descriptionText}>{description}</Text> : null}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        flexDirection: 'row',
        zIndex: 9999,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
        ...(Platform.OS === 'web'
            ? {
                bottom: 100,
                right: 20,
                width: 400,
                maxWidth: '90%',
            }
            : {
                top: 0,
                left: 20,
                right: 20,
                alignSelf: 'center',
                width: '90%',
                maxWidth: 500,
            }),
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    messageText: {
        fontSize: 16,
        color: '#1e293b',
        fontFamily: 'Inter-SemiBold',
    },
    descriptionText: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
        fontFamily: 'Inter-Regular',
    },
});
