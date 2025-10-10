import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { UnifiedTrackingData } from '@/lib/types/unifiedInterfaces';
import { TrackingForm } from '@/components/forms/tracking/TrackingForm';
import { TrackingResult } from '@/components/results/tracking/TrackingResult';

export const Track = () => {
	const [isTracking, setIsTracking] = useState(false);
	const [trackingData, setTrackingData] = useState<UnifiedTrackingData | null>(
		null,
	);
	const [expandedContainers, setExpandedContainers] = useState<Set<string>>(
		new Set(),
	);

	return (
		<ScrollView>
			{/* tracking form */}
			<TrackingForm
				isTracking={isTracking}
				setIsTracking={setIsTracking}
				setTrackingData={setTrackingData}
			/>

			{/*  Tracking Result */}
			{trackingData && (
				<View style={styles.resultContainer}>
					<TrackingResult
						trackingData={trackingData}
						expandedContainers={expandedContainers}
						setExpandedContainers={setExpandedContainers}
					/>
				</View>
			)}
		</ScrollView>
	);
};
export default Track;

const styles = StyleSheet.create({
	resultContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
	},
});
