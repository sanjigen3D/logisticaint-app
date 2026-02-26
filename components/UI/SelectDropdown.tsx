import { ChevronDown, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export type Option = {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
};

interface SelectDropdownProps {
    options: Option[];
    selectedValue?: string | number;
    onSelect: (value: string | number) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export function SelectDropdown({
    options,
    selectedValue,
    onSelect,
    placeholder = 'Seleccionar...',
    error,
    disabled = false,
    icon,
}: SelectDropdownProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (value: string | number) => {
        onSelect(value);
        setModalVisible(false);
    };

    return (
        <>
            <Pressable
                style={({ pressed }) => [
                    styles.triggerContainer,
                    error && styles.triggerError,
                    disabled && styles.triggerDisabled,
                    pressed && !disabled && { opacity: 0.7 }
                ]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <Text
                    style={[
                        styles.triggerText,
                        !selectedOption && styles.placeholderText,
                        disabled && styles.disabledText,
                    ]}
                    numberOfLines={1}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <ChevronDown size={20} color={disabled ? '#94a3b8' : '#64748b'} />
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{placeholder}</Text>
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                style={({ pressed }) => [
                                    styles.closeButton,
                                    pressed && { opacity: 0.6 }
                                ]}
                            >
                                <X size={24} color="#64748b" />
                            </Pressable>
                        </View>
                        <ScrollView
                            style={styles.optionsList}
                            showsVerticalScrollIndicator={false}
                        >
                            {options.map((option) => (
                                <Pressable
                                    key={option.value}
                                    style={({ pressed }) => [
                                        styles.optionItem,
                                        selectedValue === option.value &&
                                        styles.optionItemSelected,
                                        pressed && { backgroundColor: '#e2e8f0' }
                                    ]}
                                    onPress={() => handleSelect(option.value)}
                                >
                                    <View style={styles.optionContent}>
                                        {option.icon && (
                                            <View style={styles.optionIconContainer}>
                                                {option.icon}
                                            </View>
                                        )}
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selectedValue === option.value &&
                                                styles.optionTextSelected,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                            {options.length === 0 && (
                                <Text style={styles.emptyText}>No hay opciones disponibles</Text>
                            )}
                            {/* Bottom padding for safe area */}
                            <View style={{ height: 20 }} />
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    triggerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 50,
    },
    triggerError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    triggerDisabled: {
        backgroundColor: '#f1f5f9',
        opacity: 0.8,
    },
    iconContainer: {
        marginRight: 12,
    },
    triggerText: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#1e293b',
    },
    placeholderText: {
        color: '#64748b',
    },
    disabledText: {
        color: '#94a3b8',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
            web: {
                alignSelf: 'center',
                width: '100%',
                maxWidth: 400,
                maxHeight: 500,
                borderRadius: 24,
                marginBottom: 'auto',
                marginTop: 'auto',
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: '#1e293b',
    },
    closeButton: {
        padding: 4,
    },
    optionsList: {
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    optionItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
    },
    optionItemSelected: {
        backgroundColor: '#eff6ff',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIconContainer: {
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#334155',
        flexShrink: 1,
    },
    optionTextSelected: {
        fontFamily: 'Inter-SemiBold',
        color: '#3b82f6',
    },
    emptyText: {
        textAlign: 'center',
        paddingVertical: 24,
        color: '#64748b',
        fontFamily: 'Inter-Regular',
        fontSize: 14,
    }
});
