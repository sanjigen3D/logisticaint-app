import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

export type CardBadge = {
    label: string;
    variant: 'active' | 'inactive' | 'default';
};

export type CardAction = {
    label: string;
    icon: ReactNode;
    onPress: () => void;
    variant: 'default' | 'primary' | 'destructive';
};

interface ItemCardProps {
    title: string;
    icon?: ReactNode;
    badges?: CardBadge[];
    details?: {
        label: string;
        value: string;
        icon?: ReactNode;
    }[];
    children?: ReactNode;
    actions?: CardAction[];
    onPress?: () => void;
    style?: ViewStyle;
}

export default function ItemCard({
    title,
    icon,
    badges,
    details,
    children,
    actions,
    onPress,
    style,
}: ItemCardProps) {
    const CardContent = () => (
        <>
            <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                </View>
                {badges && badges.length > 0 && (
                    <View style={styles.badgeRow}>
                        {badges.map((badge, index) => (
                            <View key={index} style={[styles.badge, styles[`badge_${badge.variant}`]]}>
                                <Text style={[styles.badgeText, styles[`badgeText_${badge.variant}`]]}>
                                    {badge.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {details && details.length > 0 && (
                <View style={styles.detailsContainer}>
                    {details.map((detail, index) => (
                        <View key={index} style={styles.detailRow}>
                            {detail.icon && <View style={styles.detailIcon}>{detail.icon}</View>}
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>{detail.label}</Text>
                                <Text style={styles.detailValue} numberOfLines={2}>{detail.value}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {children && (
                <View style={[styles.cardBody, (!details || details.length === 0) ? { marginTop: 0 } : {}]}>
                    {children}
                </View>
            )}

            {actions && actions.length > 0 && (
                <View style={styles.cardFooter}>
                    {actions.map((action, index) => (
                        <Pressable
                            key={index}
                            style={({ pressed }) => [
                                styles.actionBtn,
                                styles[`actionBtn_${action.variant}`],
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={action.onPress}
                        >
                            {action.icon}
                            <Text style={[styles.actionBtnText, styles[`actionBtnText_${action.variant}`]]}>
                                {action.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </>
    );

    if (onPress) {
        return (
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    style,
                    pressed && styles.cardPressed
                ]}
                onPress={onPress}
            >
                <CardContent />
            </Pressable>
        );
    }

    return (
        <View style={[styles.card, style]}>
            <CardContent />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardPressed: {
        transform: [{ scale: 0.98 }],
        shadowOpacity: 0.02,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconContainer: {
        marginRight: 10,
        backgroundColor: '#f8fafc',
        padding: 8,
        borderRadius: 10,
    },
    title: {
        fontSize: 17,
        fontFamily: 'Inter-SemiBold',
        color: '#0f172a',
        flexShrink: 1,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    badge_active: {
        backgroundColor: '#ecfdf5',
        borderColor: '#a7f3d0',
    },
    badge_inactive: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    badge_default: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'Inter-Medium',
    },
    badgeText_active: {
        color: '#059669',
    },
    badgeText_inactive: {
        color: '#dc2626',
    },
    badgeText_default: {
        color: '#475569',
    },
    detailsContainer: {
        marginBottom: 16,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    detailIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: '#64748b',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#0f172a',
    },
    cardBody: {
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
        paddingTop: 16,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    actionBtn_primary: {
        backgroundColor: '#f0f9ff',
    },
    actionBtn_destructive: {
        backgroundColor: '#fef2f2',
    },
    actionBtn_default: {
        backgroundColor: '#f8fafc',
    },
    actionBtnText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
    },
    actionBtnText_primary: {
        color: '#0284c7',
    },
    actionBtnText_destructive: {
        color: '#dc2626',
    },
    actionBtnText_default: {
        color: '#475569',
    },
});
