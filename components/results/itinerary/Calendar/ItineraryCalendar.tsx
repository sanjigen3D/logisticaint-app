import DaySheet from '@/components/results/itinerary/Calendar/DaySheet';
import { UnifiedRoute } from '@/lib/types/unifiedInterfaces';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ItineraryCalendarProps = {
    routes: UnifiedRoute[];
};

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CARRIER_COLORS: Record<string, string> = {
    'ZIM': '#07174c',
    'Maersk': '#2d9cdb',
    'Hapag-Lloyd': '#e55a0b',
    'default': '#64748b',
};

function getCompanyColor(company: string): string {
    if (CARRIER_COLORS[company]) return CARRIER_COLORS[company];
    const key = Object.keys(CARRIER_COLORS).find(k =>
        company?.toLowerCase().includes(k.toLowerCase())
    );
    return key ? CARRIER_COLORS[key] : CARRIER_COLORS['default'];
}

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
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInCurrentMonth; i++) days.push(new Date(year, month, i));
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
            const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(route);
        });
        return map;
    }, [routes]);

    // Available years from data
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        routes.forEach(route => {
            if (!route.legs || route.legs.length === 0) return;
            const depDateStr = route.legs[0].departure.dateTime;
            if (depDateStr) {
                const year = new Date(depDateStr).getFullYear();
                if (!isNaN(year)) years.add(year);
            }
        });
        years.add(new Date().getFullYear());
        return Array.from(years).sort((a, b) => a - b);
    }, [routes]);

    // Months that have data for the selected year
    const monthsWithData = useMemo(() => {
        const activeYear = currentDate.getFullYear();
        const months = new Set<number>();
        Object.keys(routesByDate).forEach(dateKey => {
            const [y, m] = dateKey.split('-').map(Number);
            if (y === activeYear) months.add(m - 1); // 0-indexed
        });
        return months;
    }, [routesByDate, currentDate]);

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const changeYear = (year: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
    };

    const changeMonthDirect = (monthIdx: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(monthIdx);
        setCurrentDate(newDate);
    };

    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const selectedRoutes = selectedDate ? (routesByDate[selectedDate] || []) : [];

    return (
        <View>
            <View style={styles.container}>
                {/* Year Selector */}
                <View style={styles.yearSelector}>
                    {availableYears.map(year => (
                        <Pressable
                            key={year}
                            style={[
                                styles.yearChip,
                                currentDate.getFullYear() === year && styles.yearChipActive
                            ]}
                            onPress={() => changeYear(year)}
                        >
                            <Text style={[
                                styles.yearChipText,
                                currentDate.getFullYear() === year && styles.yearChipTextActive
                            ]}>
                                {year}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Month Selector */}
                <View style={styles.monthSelector}>
                    {MONTH_NAMES.map((name, idx) => {
                        const hasData = monthsWithData.has(idx);
                        const isActive = currentDate.getMonth() === idx;
                        return (
                            <Pressable
                                key={idx}
                                style={[
                                    styles.monthChip,
                                    hasData && styles.monthChipHasData,
                                    isActive && styles.monthChipActive,
                                ]}
                                onPress={() => changeMonthDirect(idx)}
                            >
                                <Text style={[
                                    styles.monthChipText,
                                    hasData && styles.monthChipTextHasData,
                                    isActive && styles.monthChipTextActive,
                                ]}>
                                    {name}
                                </Text>
                                {hasData && !isActive && (
                                    <View style={styles.monthDot} />
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Calendar Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => changeMonth(-1)} style={styles.navButton}>
                        <ChevronLeft size={24} color="#0f172a" />
                    </Pressable>
                    <Text style={styles.monthTitle}>
                        {capitalizedMonth}
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
                        // Use route.company (reflects the API source, not the vessel carrier)
                        const companiesPresent = Array.from(new Set(dayRoutes.map(r => r.company)));
                        const visibleCompanies = companiesPresent.slice(0, 2);
                        const overflowCount = companiesPresent.length - visibleCompanies.length;

                        return (
                            <Pressable
                                key={dateKey}
                                style={[
                                    styles.dayCell,
                                    dayRoutes.length > 0 && styles.hasRoutesDayCell,
                                    isToday && !isSelected && styles.todayCell,
                                    isSelected && styles.selectedDayCell,
                                ]}
                                onPress={() => {
                                    if (dayRoutes.length > 0) {
                                        setSelectedDate(dateKey);
                                    }
                                }}
                            >
                                <Text style={[
                                    styles.dayNumber,
                                    isSelected && styles.selectedDayText,
                                    isToday && !isSelected && styles.todayText
                                ]}>
                                    {date.getDate()}
                                </Text>

                                <View style={styles.pillsContainer}>
                                    {visibleCompanies.map((company, cIdx) => (
                                        <View
                                            key={cIdx}
                                            style={[
                                                styles.companyPill,
                                                { backgroundColor: getCompanyColor(company) }
                                            ]}
                                        >
                                            <Text style={styles.companyPillText} numberOfLines={1}>
                                                {company}
                                            </Text>
                                        </View>
                                    ))}
                                    {overflowCount > 0 && (
                                        <View style={styles.overflowPill}>
                                            <Text style={styles.overflowText}>+{overflowCount}</Text>
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* Bottom Sheet */}
            <DaySheet
                selectedDate={selectedDate}
                routes={selectedRoutes}
                onClose={() => setSelectedDate(null)}
            />
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
    yearSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    yearChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    yearChipActive: {
        backgroundColor: '#e0e7ff',
        borderColor: '#c7d2fe',
    },
    yearChipText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#64748b',
    },
    yearChipTextActive: {
        color: '#4338ca',
        fontFamily: 'Inter-Bold',
    },
    // Month selector
    monthSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 20,
    },
    monthChip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
        minWidth: 42,
    },
    monthChipHasData: {
        backgroundColor: '#dcfce7',
        borderColor: '#bbf7d0',
    },
    monthChipActive: {
        backgroundColor: '#e0e7ff',
        borderColor: '#c7d2fe',
    },
    monthChipText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#94a3b8',
    },
    monthChipTextHasData: {
        color: '#15803d',
        fontFamily: 'Inter-SemiBold',
    },
    monthChipTextActive: {
        color: '#4338ca',
        fontFamily: 'Inter-Bold',
    },
    monthDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#22c55e',
        marginTop: 2,
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
        minHeight: 56,
        padding: 3,
        borderWidth: 1,
        borderColor: '#f8fafc',
        alignItems: 'center',
    },
    hasRoutesDayCell: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        borderRadius: 10,
    },
    selectedDayCell: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        borderRadius: 10,
        borderWidth: 2,
    },
    todayCell: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
    },
    dayNumber: {
        fontFamily: 'Inter-Medium',
        fontSize: 13,
        color: '#334155',
        marginTop: 3,
        marginBottom: 2,
    },
    selectedDayText: {
        color: '#1d4ed8',
        fontFamily: 'Inter-Bold',
    },
    todayText: {
        color: '#0f172a',
        fontFamily: 'Inter-Bold',
    },
    pillsContainer: {
        width: '100%',
        gap: 2,
        alignItems: 'stretch',
        paddingBottom: 2,
    },
    companyPill: {
        borderRadius: 4,
        paddingHorizontal: 3,
        paddingVertical: 2,
        alignItems: 'center',
    },
    companyPillText: {
        fontFamily: 'Inter-Bold',
        fontSize: 7,
        color: '#ffffff',
        letterSpacing: 0.2,
    },
    overflowPill: {
        borderRadius: 4,
        paddingHorizontal: 3,
        paddingVertical: 2,
        backgroundColor: '#94a3b8',
        alignItems: 'center',
    },
    overflowText: {
        fontFamily: 'Inter-Bold',
        fontSize: 7,
        color: '#ffffff',
    },
});
