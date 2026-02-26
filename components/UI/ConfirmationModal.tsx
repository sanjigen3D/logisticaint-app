import { AlertCircle, Trash2, X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export const ConfirmationModal = ({
    visible,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isDestructive = false,
    isLoading = false,
}: ConfirmationModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.closeButton,
                            pressed && { opacity: 0.6 }
                        ]}
                        onPress={onCancel}
                        disabled={isLoading}
                    >
                        <X size={20} color="#64748b" />
                    </Pressable>

                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, isDestructive ? styles.iconCircleDestructive : styles.iconCircleWarning]}>
                            {isDestructive ? (
                                <Trash2 size={28} color="#ef4444" />
                            ) : (
                                <AlertCircle size={28} color="#eab308" />
                            )}
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>

                    <View style={styles.actionsContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.cancelButton,
                                pressed && { opacity: 0.7, backgroundColor: '#e2e8f0' }
                            ]}
                            onPress={onCancel}
                            disabled={isLoading}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                isDestructive ? styles.confirmButtonDestructive : styles.confirmButtonPrimary,
                                (isLoading || pressed) && styles.buttonDisabled
                            ]}
                            onPress={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={styles.confirmButtonText}>{confirmText}</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
    },
    iconContainer: {
        marginBottom: 16,
        marginTop: 8,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleDestructive: {
        backgroundColor: '#fef2f2',
    },
    iconCircleWarning: {
        backgroundColor: '#fefce8',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: '#0f172a',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        color: '#475569',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    actionsContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cancelButtonText: {
        fontSize: 15,
        fontFamily: 'Inter-Medium',
        color: '#475569',
    },
    confirmButtonPrimary: {
        backgroundColor: '#3b82f6',
    },
    confirmButtonDestructive: {
        backgroundColor: '#ef4444',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    confirmButtonText: {
        fontSize: 15,
        fontFamily: 'Inter-Medium',
        color: '#ffffff',
    },
});
