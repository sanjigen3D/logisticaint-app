import ResultCard from '@/components/results/itinerary/ResultCard';
import { UnifiedRoute } from '@/lib/types/unifiedInterfaces';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Brand identity per carrier
const CARRIER_BRAND: Record<string, { bg: string; text: string; accent: string }> = {
    ZIM: { bg: '#07174c', text: '#ffffff', accent: '#1e3a8a' },
    'Hapag-Lloyd': { bg: '#f26e21', text: '#ffffff', accent: '#c2560e' },
    Maersk: { bg: '#2d9cdb', text: '#ffffff', accent: '#1a6fa3' },
    default: { bg: '#1e293b', text: '#ffffff', accent: '#334155' },
};

function getBrand(company: string) {
    if (CARRIER_BRAND[company]) return CARRIER_BRAND[company];
    const key = Object.keys(CARRIER_BRAND).find(k =>
        company?.toLowerCase().includes(k.toLowerCase())
    );
    return key ? CARRIER_BRAND[key] : CARRIER_BRAND.default;
}

type CarrierSectionProps = {
    company: string;
    routes: UnifiedRoute[];
};

const CarrierSection = ({ company, routes }: CarrierSectionProps) => {
    const [expanded, setExpanded] = useState(true);
    const rotateAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

    const toggle = () => {
        const toValue = expanded ? 0 : 1;
        Animated.spring(rotateAnim, {
            toValue,
            useNativeDriver: true,
            damping: 15,
            stiffness: 200,
        }).start();
        setExpanded(prev => !prev);
    };

    const chevronRotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const brand = getBrand(company);
    const count = routes.length;

    return (
        <View style={styles.sectionWrapper}>
            {/* Accordion Header */}
            <Pressable
                onPress={toggle}
                style={({ pressed }) => [
                    styles.header,
                    { backgroundColor: brand.bg },
                    pressed && styles.headerPressed,
                ]}
            >
                <View style={styles.headerLeft}>
                    <View style={[styles.dot, { backgroundColor: brand.accent }]} />
                    <Text style={[styles.companyName, { color: brand.text }]}>{company}</Text>
                    <View style={[styles.countBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Text style={[styles.countText, { color: brand.text }]}>
                            {count} {count === 1 ? 'ruta' : 'rutas'}
                        </Text>
                    </View>
                </View>
                <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
                    {expanded ? (
                        <ChevronUp size={20} color={brand.text} strokeWidth={2.5} />
                    ) : (
                        <ChevronDown size={20} color={brand.text} strokeWidth={2.5} />
                    )}
                </Animated.View>
            </Pressable>

            {/* Expanded Content */}
            {expanded && (
                <View style={styles.content}>
                    {count === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No se encontraron rutas disponibles</Text>
                        </View>
                    ) : (
                        routes.map((route, index) => (
                            <ResultCard key={route.id || index} route={route} />
                        ))
                    )}
                </View>
            )}
        </View>
    );
};

export default CarrierSection;

const styles = StyleSheet.create({
    sectionWrapper: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    headerPressed: {
        opacity: 0.88,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    companyName: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        letterSpacing: 0.2,
        flex: 1,
    },
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    countText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 12,
    },
    content: {
        backgroundColor: '#f8fafc',
        padding: 12,
        gap: 8,
    },
    emptyState: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#94a3b8',
    },
});
