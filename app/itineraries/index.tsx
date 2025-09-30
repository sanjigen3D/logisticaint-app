import ZimResults from '@/components/results/zim/ZimResults';
import { useGlobalSearchParams } from 'expo-router';
import { Ship } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import MaerskResults from '@/components/results/maersk/MaerskResult';
import HapagResults from '@/components/results/hapag/HapagResult';
import Navbar from '@/components/UI/navbar';

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
			<View style={styles.container}>
				<ScrollView style={styles.scrollView}>
					<Navbar
						title={'Resultados de Búsqueda'}
						subtitle={'No se encontraron resultados'}
						icon={<Ship size={32} color="#ffffff" />}
					/>
				</ScrollView>
			</View>
		);
	}

	const originCode = `${originCountry}${oriLocation}`;
	const destinationCode = `${destinationCountry}${destLocation}`;

	return (
		<View style={styles.container}>
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	header: {
		paddingTop: 60,
		paddingBottom: 40,
	},
	headerContainer: {
		width: '100%',
		maxWidth: 1200,
		alignSelf: 'center',
		paddingHorizontal: 20,
		position: 'relative',
	},
	headerContent: {
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 24,
		fontFamily: 'Inter-Bold',
		color: '#ffffff',
		marginTop: 8,
	},
	headerSubtitle: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#bfdbfe',
		marginTop: 4,
		textAlign: 'center',
	},
	backButton: {
		position: 'absolute',
		left: 20,
		top: 0,
		zIndex: 1,
		padding: 8,
	},
	mainContainer: {
		flex: 6,
		width: '100%',
		maxWidth: 900,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});
