import { ZimApiResponse } from '@/components/results/zim/zimTypes';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
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

	if (!data) return null;

	const {
		response: { routes },
	} = data as ZimApiResponse;
	console.log(routes.length);

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
			<View style={styles.summaryContainer}>
				<Text style={styles.summaryTitle}>
					Zim Integrated Shipping Services ({routes.length})
				</Text>
				<ResultCard />
			</View>
		);
	}

	return <ActivityIndicator size="large" color="#5a8ce8" />;
};
export default ZimResults;

const styles = StyleSheet.create({
	summaryContainer: {
		paddingTop: 20,
		paddingBottom: 16,
	},
	summaryTitle: {
		fontSize: 20,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
	},
});
