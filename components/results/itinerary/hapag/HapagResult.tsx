import LoadingComp from '@/components/UI/Loading';
import ResultCard from '@/components/results/itinerary/ResultCard';
import { HapagAPIResponse } from '@/lib/types/hapag/hapagTypes';
import { mapHapagToUnified } from '@/lib/mappers/HapagMapper';
import { useQuery } from '@tanstack/react-query';
import { ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { useState } from 'react';
import {
	ActivityIndicator,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { ROUTES } from '@/lib/Routes';

type HapagResultsProps = {
	origin: string;
	destination: string;
};

const fetchHapagData = async (origCode: string, destCode: string) => {
	const response = await fetch(
		`${ROUTES.API_ROUTE}/itinerary/Hapag?origin=${encodeURIComponent(origCode)}&destination=${encodeURIComponent(destCode)}`,
	);
	if (!response.ok) throw new Error('Error al obtener datos');
	return response.json();
};

// Llamado a la API con la info pasada de la vista en result
const HapagResults = ({ origin, destination }: HapagResultsProps) => {
	const [expanded, setExpanded] = useState(true);
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['hapagResults', origin, destination],
		queryFn: () => fetchHapagData(origin, destination),
		enabled: !!origin && !!destination,
	});

	if (isLoading) {
		return (
			<LoadingComp loading={isLoading} text={'Cargando opciones de envío...'} />
		);
	}

	if (!Array.isArray(data) || data.length === 0) {
		return (
			<View style={resultItineraryStyles.summaryContainer}>
				<View className={'flex flex-row gap-3 items-center'}>
					<Text style={resultItineraryStyles.summaryTitle}>
						Hapag - Lloyd (0)
					</Text>
					<Pressable
						className="hover:bg-gray-200 rounded-full p-1"
						onPress={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<ChevronsUp size={24} color="#000" />
						) : (
							<ChevronsDown size={24} color="#000" />
						)}
					</Pressable>
				</View>

				{expanded && (
					<Text style={resultItineraryStyles.loadingText}>
						No se encontraron resultados
					</Text>
				)}
			</View>
		);
	}

	// mapper para estructurar todo a un mismo tipo y usarlo en las Cards
	const routes = mapHapagToUnified(data as HapagAPIResponse);

	console.log(routes);

	if (isError) {
		return (
			<View>
				<Text>Error</Text>
				<Text>{error.message}</Text>
			</View>
		);
	}

	if (routes.length > 0) {
		return (
			<ScrollView showsVerticalScrollIndicator={Platform.OS !== 'web'}>
				<View style={resultItineraryStyles.summaryContainer}>
					<View className={'flex flex-row gap-3 items-center'}>
						<Text style={resultItineraryStyles.summaryTitle}>
							Hapag - Lloyd ({routes.length})
						</Text>
						<Pressable
							className="hover:bg-gray-200 rounded-full p-1"
							onPress={() => setExpanded(!expanded)}
						>
							{expanded ? (
								<ChevronsUp size={24} color="#000" />
							) : (
								<ChevronsDown size={24} color="#000" />
							)}
						</Pressable>
					</View>

					{expanded &&
						routes.map((route, index) => (
							<ResultCard key={index} route={route} />
						))}
				</View>
			</ScrollView>
		);
	}

	return <ActivityIndicator size="large" color="#5a8ce8" />;
};
export default HapagResults;

export const resultItineraryStyles = StyleSheet.create({
	summaryContainer: {
		paddingTop: 20,
		paddingBottom: 16,
	},
	summaryTitle: {
		fontSize: 20,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
	},
	scrollContent: {
		flexGrow: 1,
	},
	loadingText: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
});
