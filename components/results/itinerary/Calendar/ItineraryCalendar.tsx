import ResultCard from '@/components/results/itinerary/ResultCard';
import { UnifiedRoute } from '@/lib/types/unifiedInterfaces';
import { ChevronLeft, ChevronRight, Ship } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ItineraryCalendarProps = {
    routes: UnifiedRoute[];
};

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const CARRIER_COLORS: Record<string, string> = {
    'ZIM': '#07174c',     // Navy
    'Maersk': '#2d9cdb',  // Light Blue
    'Hapag-Lloyd': '#f26e21', // Orange
    'default': '#64748b'
};

const ItineraryCalendar = ({ routes }: ItineraryCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Get month grid days
    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Padding previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Current month days
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    }, [currentDate]);

    // Map routes to dates string 'YYYY-MM-DD'
    const routesByDate = useMemo(() => {
        const map: Record<string, UnifiedRoute[]> = {};
        routes.forEach(route => {
            if (!route.legs || route.legs.length === 0) return;
            const depDateStr = route.legs[0].departure.dateTime;
            if (!depDateStr) return;

            const dateObj = new Date(depDateStr);
            if (isNaN(dateObj.getTime())) return;

            // Format YYYY-MM-DD in local time to avoid timezone shifts
            const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(route);
        });
        return map;
    }, [routes]);

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    // Routes for selected date
    const selectedRoutes = selectedDate ? (routesByDate[selectedDate] || []) : [];

    return (
        <View style={styles.container}>
            {/* Calendar Header */}
            <View style={styles.header}>
                <Pressable onPress={() => changeMonth(-1)} style={styles.navButton}>
                    <ChevronLeft size={24} color="#0f172a" />
                </Pressable>
                <Text style={styles.monthTitle}>
                    {capitalizedMonth} {currentDate.getFullYear()}
                </Text>
                <Pressable onPress={() => changeMonth(1)} style={styles.navButton}>
                    <ChevronRight size={24} color="#0f172a" />
                </Pressable>
            </View>

            {/* Days of Week */}
            <View style={styles.weekDays}>
                {DAYS_OF_WEEK.map((day, idx) => (
                    <Text key={idx} style={styles.weekDayText}>{day}</Text>
                ))}
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {daysInMonth.map((date, idx) => {
                    if (!date) {
                        return <View key={`empty-${idx}`} style={styles.dayCell} />;
                    }

                    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    const dayRoutes = routesByDate[dateKey] || [];
                    const isSelected = selectedDate === dateKey;
                    const isToday = new Date().toDateString() === date.toDateString();

                    // Group carriers for pill indicators
                    const carriersPresent = Array.from(new Set(dayRoutes.map(r => r.carrier)));

                    return (
                        <Pressable
                            key={dateKey}
                            style={[
                                styles.dayCell,
                                isSelected && styles.selectedDayCell,
                                isToday && !isSelected && styles.todayCell
                            ]}
                            onPress={() => setSelectedDate(dateKey)}
                        >
                            <Text style={[
                                styles.dayNumber,
                                isSelected && styles.selectedDayText,
                                isToday && !isSelected && styles.todayText
                            ]}>
                                {date.getDate()}
                            </Text>

                            <View style={styles.indicators}>
                                {carriersPresent.slice(0, 3).map((carrier, cIdx) => (
                                    <View
                                        key={cIdx}
                                        style={[
                                            styles.carrierDot,
                                            { backgroundColor: CARRIER_COLORS[carrier] || CARRIER_COLORS['default'] }
                                        ]}
                                    />
                                ))}
                                {carriersPresent.length > 3 && (
                                    <Text style={styles.moreIndicators}>+</Text>
                                )}
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* Detail View for Selected Date */}
            {selectedDate && (
                <View style={styles.detailContainer}>
                    <View style={styles.detailHeader}>
                        <Text style={styles.detailTitle}>
                            Salidas para el {selectedDate.split('-').reverse().join('/')}
                        </Text>
                        <Text style={styles.detailBadge}>{selectedRoutes.length} viajes</Text>
                    </View>

                    {selectedRoutes.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ship size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>No hay salidas programadas para este día.</Text>
                        </View>
                    ) : (
                        <View style={styles.resultsList}>
                            {selectedRoutes.map((route, idx) => (
                                <ResultCard key={route.id || idx} route={route} />
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default ItineraryCalendar;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    monthTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#0f172a',
    },
    navButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
    },
    weekDays: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 13,
        color: '#64748b',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        padding: 4,
        borderWidth: 1,
        borderColor: '#f8fafc',
        alignItems: 'center',
    },
    selectedDayCell: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        borderRadius: 12,
    },
    todayCell: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
    },
    dayNumber: {
        fontFamily: 'Inter-Medium',
        fontSize: 15,
        color: '#334155',
        marginTop: 4,
    },
    selectedDayText: {
        color: '#1d4ed8',
        fontFamily: 'Inter-Bold',
    },
    todayText: {
        color: '#0f172a',
        fontFamily: 'Inter-Bold',
    },
    indicators: {
        flexDirection: 'row',
        marginTop: 'auto',
        marginBottom: 4,
        gap: 3,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    carrierDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    moreIndicators: {
        fontSize: 8,
        color: '#64748b',
        fontFamily: 'Inter-Bold',
    },
    detailContainer: {
        marginTop: 32,
        paddingTop: 32,
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    detailTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#0f172a',
    },
    detailBadge: {
        backgroundColor: '#e0e7ff',
        color: '#4338ca',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        fontFamily: 'Inter-Medium',
        fontSize: 13,
        overflow: 'hidden',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        gap: 12,
    },
    emptyText: {
        fontFamily: 'Inter-Medium',
        fontSize: 15,
        color: '#64748b',
    },
    resultsList: {
        gap: 16,
    }
});
