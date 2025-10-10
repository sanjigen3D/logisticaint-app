import ZimResults from '@/components/results/itinerary/zim/ZimResults';
import { useGlobalSearchParams } from 'expo-router';
import { Ship } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import MaerskResults from '@/components/results/itinerary/maersk/MaerskResult';
import HapagResults from '@/components/results/itinerary/hapag/HapagResult';
import Navbar from '@/components/UI/navbar/navbar';

// este componente sirve para pasar la información a los demás que mostraran las llamadas de las API
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
			<Navbar
				title={'Resultados de Búsqueda'}
				subtitle={'No se encontraron resultados'}
				icon={<Ship size={32} color="#ffffff" />}
			/>
		);
	}

	const originCode = `${originCountry}${oriLocation}`;
	const destinationCode = `${destinationCountry}${destLocation}`;

	return (
		<>
			{/* HEADER */}
			<Navbar
				title={'Resultados de Búsqueda'}
				subtitle={`${origin}(${originCode}) → ${destination}(${destinationCode})`}
				icon={<Ship size={32} color="#ffffff" />}
				backButton={true}
			/>

			{/* RESULTADOS */}
			<ScrollView style={styles.scrollView}>
				<View style={styles.mainContainer}>
					<ZimResults origin={originCode} destination={destinationCode} />
					<MaerskResults origin={originCode} destination={destinationCode} />
					<HapagResults origin={originCode} destination={destinationCode} />
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	itineraryContainer: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	scrollView: {
		flex: 1,
	},
	mainContainer: {
		flex: 6,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});
