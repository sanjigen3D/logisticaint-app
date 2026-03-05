import { useQueries } from '@tanstack/react-query';
import { useGlobalSearchParams } from 'expo-router';
import { CalendarDays, LayoutList, Ship } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import LoadingComp from '@/components/UI/Loading';
import Navbar from '@/components/UI/navbar/navbar';
import ItineraryCalendar from '@/components/results/itinerary/Calendar/ItineraryCalendar';
import CarrierSection from '@/components/results/itinerary/CarrierSection';

import { ROUTES } from '@/lib/Routes';
import { mapHapagToUnified } from '@/lib/mappers/HapagMapper';
import { mapMaerskToUnified } from '@/lib/mappers/MaerskMapper';
import { mapZimResponseToUnifiedRoutes } from '@/lib/mappers/ZimMapper';
import { UnifiedRoute } from '@/lib/types/unifiedInterfaces';

const fetchZimData = async (origCode: string, destCode: string) => {
	const response = await fetch(
		`${ROUTES.API_ROUTE}/itinerary/Zim?origin=${encodeURIComponent(origCode)}&destination=${encodeURIComponent(destCode)}`,
	);
	if (!response.ok) throw new Error('ZIM API Error');
	return response.json();
};

const fetchMaerskData = async (origCode: string, destCode: string) => {
	const response = await fetch(
		`${ROUTES.API_ROUTE}/itinerary/Maersk?origin=${encodeURIComponent(origCode)}&destination=${encodeURIComponent(destCode)}`,
	);
	if (!response.ok) throw new Error('Maersk API Error');
	return response.json();
};

const fetchHapagData = async (origCode: string, destCode: string) => {
	const response = await fetch(
		`${ROUTES.API_ROUTE}/itinerary/Hapag?origin=${encodeURIComponent(origCode)}&destination=${encodeURIComponent(destCode)}`,
	);
	if (!response.ok) throw new Error('Hapag API Error');
	return response.json();
};

type ViewMode = 'list' | 'calendar';

export default function ResultsPage() {
	const {
		origin,
		originCountry,
		oriLocation,
		destination,
		destinationCountry,
		destLocation,
	} = useGlobalSearchParams();

	const [viewMode, setViewMode] = useState<ViewMode>('list');

	const originCode = `${originCountry ?? ''}${oriLocation ?? ''}`;
	const destinationCode = `${destinationCountry ?? ''}${destLocation ?? ''}`;

	const results = useQueries({
		queries: [
			{
				queryKey: ['zimResults', originCode, destinationCode],
				queryFn: () => fetchZimData(originCode, destinationCode),
				enabled: !!origin && !!destination && !!originCode && !!destinationCode,
			},
			{
				queryKey: ['maerskResults', originCode, destinationCode],
				queryFn: () => fetchMaerskData(originCode, destinationCode),
				enabled: !!origin && !!destination && !!originCode && !!destinationCode,
			},
			{
				queryKey: ['hapagResults', originCode, destinationCode],
				queryFn: () => fetchHapagData(originCode, destinationCode),
				enabled: !!origin && !!destination && !!originCode && !!destinationCode,
			},
		],
	});

	const isLoading = results.some((query) => query.isLoading);
	const isError = results.every((query) => query.isError);

	const allRoutes = useMemo(() => {
		const [zimQuery, maerskQuery, hapagQuery] = results;
		let combined: UnifiedRoute[] = [];

		if (zimQuery.isSuccess && zimQuery.data?.response?.routes) {
			try {
				combined = [...combined, ...mapZimResponseToUnifiedRoutes(zimQuery.data)];
			} catch (e) {
				console.error('Zim Mapping error', e);
			}
		}

		if (maerskQuery.isSuccess && maerskQuery.data?.oceanProducts) {
			try {
				combined = [...combined, ...mapMaerskToUnified(maerskQuery.data)];
			} catch (e) {
				console.error('Maersk Mapping error', e);
			}
		}

		if (hapagQuery.isSuccess && Array.isArray(hapagQuery.data) && hapagQuery.data.length > 0) {
			try {
				combined = [...combined, ...mapHapagToUnified(hapagQuery.data)];
			} catch (e) {
				console.error('Hapag Mapping error', e);
			}
		}

		return combined;
	}, [results]);

	// Group routes by company for list view
	const routesByCompany = useMemo(() => {
		const groups: Record<string, UnifiedRoute[]> = {};
		allRoutes.forEach(route => {
			if (!groups[route.company]) groups[route.company] = [];
			groups[route.company].push(route);
		});
		return groups;
	}, [allRoutes]);

	// Fixed carrier display order
	const CARRIER_ORDER = ['Hapag-Lloyd', 'Maersk', 'ZIM'];
	const orderedCompanies = [
		...CARRIER_ORDER.filter(c => routesByCompany[c]),
		...Object.keys(routesByCompany).filter(c => !CARRIER_ORDER.includes(c)),
	];

	if (!origin || !destination) {
		return (
			<View style={styles.itineraryContainer}>
				<Navbar
					title={'Resultados de Búsqueda'}
					subtitle={'No se encontraron resultados'}
					icon={<Ship size={32} color="#ffffff" />}
				/>
			</View>
		);
	}

	return (
		<View style={styles.itineraryContainer}>
			<Navbar
				title={'Resultados de Itinerario'}
				subtitle={`${origin} → ${destination}`}
				icon={<Ship size={28} color="#ffffff" />}
			/>

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<View style={styles.mainContainer}>
					{/* Title + Toggle Row */}
					<View style={styles.headerRow}>
						<View style={styles.titleBlock}>
							<Text style={styles.sectionTitle}>
								{viewMode === 'list' ? 'Rutas Disponibles' : 'Calendario de Salidas'}
							</Text>
							<Text style={styles.sectionSubtitle}>
								{allRoutes.length} embarques encontrados
							</Text>
						</View>

						{/* Segmented Toggle */}
						<View style={styles.toggle}>
							<Pressable
								onPress={() => setViewMode('list')}
								style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
							>
								<LayoutList
									size={18}
									color={viewMode === 'list' ? '#ffffff' : '#64748b'}
									strokeWidth={2}
								/>
								<Text style={[styles.toggleLabel, viewMode === 'list' && styles.toggleLabelActive]}>
									Lista
								</Text>
							</Pressable>
							<Pressable
								onPress={() => setViewMode('calendar')}
								style={[styles.toggleBtn, viewMode === 'calendar' && styles.toggleBtnActive]}
							>
								<CalendarDays
									size={18}
									color={viewMode === 'calendar' ? '#ffffff' : '#64748b'}
									strokeWidth={2}
								/>
								<Text style={[styles.toggleLabel, viewMode === 'calendar' && styles.toggleLabelActive]}>
									Calendario
								</Text>
							</Pressable>
						</View>
					</View>

					{/* Loading State */}
					{isLoading && (
						<LoadingComp loading={isLoading} text={'Buscando rutas disponibles...'} />
					)}

					{/* Error State */}
					{!isLoading && isError && (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>
								No se pudo conectar con las navieras en este momento. Intenta de nuevo.
							</Text>
						</View>
					)}

					{/* Content */}
					{!isLoading && !isError && (
						viewMode === 'list' ? (
							<View style={styles.listWrapper}>
								{orderedCompanies.length === 0 ? (
									<View style={styles.emptyContainer}>
										<Ship size={48} color="#cbd5e1" />
										<Text style={styles.emptyText}>No se encontraron rutas para esta búsqueda</Text>
									</View>
								) : (
									orderedCompanies.map(company => (
										<CarrierSection
											key={company}
											company={company}
											routes={routesByCompany[company] || []}
										/>
									))
								)}
							</View>
						) : (
							<View style={styles.calendarWrapper}>
								<ItineraryCalendar routes={allRoutes} />
							</View>
						)
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	itineraryContainer: {
		flex: 1,
		backgroundColor: '#f1f5f9',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	mainContainer: {
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 16,
		paddingTop: 20,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: 20,
		gap: 12,
	},
	titleBlock: {
		flex: 1,
	},
	sectionTitle: {
		fontFamily: 'Inter-Bold',
		fontSize: 22,
		color: '#0f172a',
		marginBottom: 2,
	},
	sectionSubtitle: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: '#64748b',
	},
	// Segmented toggle control
	toggle: {
		flexDirection: 'row',
		backgroundColor: '#e2e8f0',
		borderRadius: 12,
		padding: 3,
	},
	toggleBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 10,
	},
	toggleBtnActive: {
		backgroundColor: '#1e40af',
		shadowColor: '#1e40af',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 3,
	},
	toggleLabel: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 13,
		color: '#64748b',
	},
	toggleLabelActive: {
		color: '#ffffff',
	},
	listWrapper: {
		gap: 0,
	},
	calendarWrapper: {
		gap: 8,
	},
	errorContainer: {
		backgroundColor: '#fee2e2',
		padding: 20,
		borderRadius: 16,
		marginTop: 8,
	},
	errorText: {
		fontFamily: 'Inter-Medium',
		color: '#991b1b',
		textAlign: 'center',
	},
	emptyContainer: {
		alignItems: 'center',
		paddingVertical: 60,
		gap: 16,
	},
	emptyText: {
		fontFamily: 'Inter-Medium',
		fontSize: 15,
		color: '#94a3b8',
		textAlign: 'center',
	},
});
