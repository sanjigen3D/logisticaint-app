import { quickActionsHome } from '@/lib/constants';
import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { View, Text, StyleSheet } from 'react-native';

export default function Index() {
	return (
		<View style={[styles.container]}>
			<Text>Bienvenido: </Text>
			<QuickMenu quickActions={quickActionsHome} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
});