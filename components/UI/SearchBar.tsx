import { Filter, Search, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFilterPress?: () => void;
    showFilter?: boolean;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Buscar...',
    onFilterPress,
    showFilter = false,
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, showFilter && styles.inputContainerWithFilter]}>
                <Search size={20} color="#94a3b8" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {value.length > 0 && (
                    <Pressable
                        onPress={() => onChangeText('')}
                        style={({ pressed }) => [
                            styles.clearBtn,
                            pressed && { opacity: 0.7 }
                        ]}
                    >
                        <View style={styles.clearIconBg}>
                            <X size={14} color="#64748b" />
                        </View>
                    </Pressable>
                )}
            </View>

            {showFilter && onFilterPress && (
                <Pressable
                    onPress={onFilterPress}
                    style={({ pressed }) => [
                        styles.filterBtn,
                        pressed && styles.filterBtnPressed
                    ]}
                >
                    <Filter size={20} color="#475569" />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        height: 48,
    },
    inputContainerWithFilter: {
        // Optional state adjustments when filter button is present
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#0f172a',
    },
    clearBtn: {
        padding: 4,
        marginLeft: 8,
    },
    clearIconBg: {
        backgroundColor: '#e2e8f0',
        borderRadius: 10,
        padding: 4,
    },
    filterBtn: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterBtnPressed: {
        backgroundColor: '#f1f5f9',
        borderColor: '#cbd5e1',
    },
});
