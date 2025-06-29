import {
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import ZimResults from '@/components/results/zim/ZimResults';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Ship } from 'lucide-react-native';

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

	const originCode = `${originCountry}${oriLocation}`;
	const destinationCode = `${destinationCountry}${destLocation}`;

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollView}>
				{/* HEADER */}
				<LinearGradient colors={['#07174c', '#0b3477']} style={styles.header}>
					<View style={styles.headerContainer}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.push('/')}
						>
							<ArrowLeft size={24} color="#ffffff" />
						</TouchableOpacity>
						<View style={styles.headerContent}>
							<View className={'flex flex-row items-center space-x-4'}>
								<Ship size={32} color="#ffffff" />
								<Text style={styles.headerTitle}>Resultados de Búsqueda</Text>
							</View>
							<Text style={styles.headerSubtitle} className="mt-4">
								{origin}({originCode}) → {destination}({destinationCode})
							</Text>
						</View>
					</View>
				</LinearGradient>
			</ScrollView>

			{/* RESULTADOS */}
			<View style={styles.mainContainer}>
				<ZimResults origin={originCode} destination={destinationCode} />
			</View>
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
		flex: 1,
		width: '100%',
		maxWidth: 900,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});
