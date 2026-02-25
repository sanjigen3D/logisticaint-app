import { useQueries } from '@tanstack/react-query';
import { useGlobalSearchParams } from 'expo-router';
import { Ship } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import LoadingComp from '@/components/UI/Loading';
import Navbar from '@/components/UI/navbar/navbar';
import ItineraryCalendar from '@/components/results/itinerary/Calendar/ItineraryCalendar';

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

export default function ResultsPage() {
	const {
		origin,
		originCountry,
		oriLocation,
		destination,
		destinationCountry,
		destLocation,
	} = useGlobalSearchParams();

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

	const originCode = `${originCountry}${oriLocation}`;
	const destinationCode = `${destinationCountry}${destLocation}`;

	const results = useQueries({
		queries: [
			{
				queryKey: ['zimResults', originCode, destinationCode],
				queryFn: () => fetchZimData(originCode, destinationCode),
				enabled: !!originCode && !!destinationCode,
			},
			{
				queryKey: ['maerskResults', originCode, destinationCode],
				queryFn: () => fetchMaerskData(originCode, destinationCode),
				enabled: !!originCode && !!destinationCode,
			},
			{
				queryKey: ['hapagResults', originCode, destinationCode],
				queryFn: () => fetchHapagData(originCode, destinationCode),
				enabled: !!originCode && !!destinationCode,
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

	return (
		<View style={styles.itineraryContainer}>
			<Navbar
				title={'Resultados de Calendario'}
				subtitle={`${origin}(${originCode}) → ${destination}(${destinationCode})`}
				icon={<Ship size={32} color="#ffffff" />}
				backButton={true}
			/>

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<View style={styles.mainContainer}>
					{isLoading && (
						<LoadingComp loading={isLoading} text={'Cargando calendario de salidas...'} />
					)}

					{!isLoading && isError && (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>
								No se pudo conectar con las navieras en este momento. Intenta de nuevo.
							</Text>
						</View>
					)}

					{!isLoading && !isError && (
						<View style={styles.calendarWrapper}>
							<Text style={styles.sectionTitle}>Calendario de Salidas</Text>
							<Text style={styles.sectionSubtitle}>
								Selecciona un día para ver los detalles de los embarques planificados ({allRoutes.length} disponibles)
							</Text>
							<ItineraryCalendar routes={allRoutes} />
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	itineraryContainer: {
		flex: 1,
		backgroundColor: '#f8fafc', // Light slate background for contrast with cards
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 100, // safe area for tab bar
	},
	mainContainer: {
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
		paddingTop: 32,
	},
	errorContainer: {
		backgroundColor: '#fee2e2',
		padding: 20,
		borderRadius: 16,
		marginTop: 20,
	},
	errorText: {
		fontFamily: 'Inter-Medium',
		color: '#991b1b',
		textAlign: 'center',
	},
	calendarWrapper: {
		gap: 8,
	},
	sectionTitle: {
		fontFamily: 'Inter-Bold',
		fontSize: 24,
		color: '#0f172a',
	},
	sectionSubtitle: {
		fontFamily: 'Inter-Regular',
		fontSize: 15,
		color: '#64748b',
		marginBottom: 16,
	},
});
