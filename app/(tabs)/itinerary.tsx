import {View, StyleSheet} from 'react-native';
import PortSearchForm from '@/components/forms/itinery/PortSearchForm';

export const Itinerary = () => {
	return (
		<View style={styles.indexContainer}>
			<View style={styles.indexContainer} className="md:pt-10">
				<PortSearchForm />
			</View>
		</View>
	);
}

export default Itinerary;

const styles = StyleSheet.create({
	indexContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	indexContent: {
		paddingTop: 20,
	},
});