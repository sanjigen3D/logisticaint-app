import PortSearchForm from '@/components/forms/itinery/PortSearchForm';
import { Platform, ScrollView, StyleSheet } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export const Itinerary = () => {
	return (
		<ScrollView
			style={styles.scroll}
			contentContainerStyle={styles.content}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
		>
			<PortSearchForm />
		</ScrollView>
	);
};

export default Itinerary;

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	content: {
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: TAB_BAR_HEIGHT,
	},
});