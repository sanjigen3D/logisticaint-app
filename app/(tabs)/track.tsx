import { TrackingForm } from '@/components/forms/tracking/TrackingForm';
import { TrackingResult } from '@/components/results/tracking/TrackingResult';
import { UnifiedTrackingData } from '@/lib/types/unifiedInterfaces';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 108 : 96;

export const Track = () => {
	const [isTracking, setIsTracking] = useState(false);
	const [trackingData, setTrackingData] = useState<UnifiedTrackingData | null>(null);
	const [expandedContainers, setExpandedContainers] = useState<Set<string>>(new Set());

	return (
		<ScrollView
			style={styles.scroll}
			contentContainerStyle={styles.content}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
		>
			{/* Tracking form */}
			<TrackingForm
				isTracking={isTracking}
				setIsTracking={setIsTracking}
				setTrackingData={setTrackingData}
			/>

			{/* Tracking Result */}
			{trackingData && (
				<TrackingResult
					trackingData={trackingData}
					expandedContainers={expandedContainers}
					setExpandedContainers={setExpandedContainers}
				/>
			)}
		</ScrollView>
	);
};
export default Track;

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	content: {
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingBottom: TAB_BAR_HEIGHT,
	},
});
