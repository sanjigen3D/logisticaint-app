import { ZimApiResponse } from '@/components/results/zim/zimTypes';
import { View, StyleSheet, Text } from 'react-native';
import LoadingComp from '@/components/Loading';
import ResultCard from '@/components/results/ResultCard';
import { useQuery } from '@tanstack/react-query';

type ZimResultsProps = {
	origin: string;
	destination: string;
};

const fetchZimData = async (origCode: string, destCode: string) => {
	const response = await fetch(
		`https://marines-services.vercel.app/Zim/itinerarySearch?origin=${encodeURIComponent(origCode)}&destination=${encodeURIComponent(destCode)}`,
	);
	if (!response.ok) throw new Error('Error al obtener datos');
	return response.json();
};

// En este componente llamaré a la API con la info pasada de la vista en result
const ZimResults = ({ origin, destination }: ZimResultsProps) => {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['zimResults', origin, destination],
		queryFn: () => fetchZimData(origin, destination),
		enabled: !!origin && !!destination,
	});

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

	return (
		<View>
			<ResultCard />
		</View>
	);
};
export default ZimResults;
