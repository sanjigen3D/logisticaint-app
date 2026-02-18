import { quickActionsAccount } from '@/lib/constants';
import QuickMenu from '@/components/UI/Tabs/QuickMenu';
import { StyleSheet, View } from 'react-native';


export default function AccountHomeScreen() {
		return (
			<View style={[styles.container]}>
				<QuickMenu quickActions={quickActionsAccount} />
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