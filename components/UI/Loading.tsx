import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type LoadingProps = {
	loading: boolean;
	text?: string;
};

const LoadingComp = ({ loading, text }: LoadingProps) => {
	if (!loading) {
		return;
	}
	return (
		<View style={styles.loadingContainer}>
			<Text style={styles.loadingText}>{text}</Text>
			<ActivityIndicator size="large" color="#5a8ce8" className="mt-4" />
		</View>
	);
};
export default LoadingComp;

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
});
