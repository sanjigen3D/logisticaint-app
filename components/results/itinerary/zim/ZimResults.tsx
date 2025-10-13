import LoadingComp from '@/components/UI/Loading';
import ResultCard from '@/components/results/itinerary/ResultCard';
import { ZimResponse } from '@/lib/types/zim/zimTypes';
import { mapZimResponseToUnifiedRoutes } from '@/lib/mappers/ZimMapper';
import { useQuery } from '@tanstack/react-query';
import { ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { useState } from 'react';
import {
	ActivityIndicator,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { ROUTES } from '@/lib/Routes';
import { resultItineraryStyles } from '@/components/results/itinerary/hapag/HapagResult';

type ZimResultsProps = {
	origin: string;
	destination: string;
};

const fetchZimData = async (origCode: string, destCode: string) => {
	const response = await fetch(
		`${ROUTES.API_ROUTE}/itinerary/Zim?origin=${encodeURIComponent(origCode)}&destination=${encodeURIComponent(destCode)}`,
	);
	if (!response.ok) throw new Error('Error al obtener datos');
	return response.json();
};

// En este componente llamaré a la API con la info pasada de la vista en result
const ZimResults = ({ origin, destination }: ZimResultsProps) => {
	const [expanded, setExpanded] = useState(true);
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['zimResults', origin, destination],
		queryFn: () => fetchZimData(origin, destination),
		enabled: !!origin && !!destination,
	});

	if (!data || !data.response) {
		return (
			<View style={resultItineraryStyles.summaryContainer}>
				<View className={'flex flex-row gap-3 items-center'}>
					<Text style={resultItineraryStyles.summaryTitle}>ZIM (0)</Text>
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

	const routes = mapZimResponseToUnifiedRoutes(data as ZimResponse);

	if (isLoading) {
		return (
			<LoadingComp loading={isLoading} text={'Cargando opciones de envío...'} />
		);
	}

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
							Zim Integrated Shipping Services ({routes.length})
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
export default ZimResults;
