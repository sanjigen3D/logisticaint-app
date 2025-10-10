import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
	MapPin,
	Clock,
	CircleCheck as CheckCircle,
	Ship,
	Box,
	Calendar,
	ChevronDown,
	ChevronUp,
} from 'lucide-react-native';
import { UnifiedTrackingData } from '@/lib/types/unifiedInterfaces';
import { formatDate } from '@/lib/utils';
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

	// para no mostrar toda la info de los container si el usuario no lo quiere
	const toggleContainerExpansion = (containerNumber: string) => {
		setExpandedContainers((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(containerNumber)) {
				newSet.delete(containerNumber);
			} else {
				newSet.add(containerNumber);
			}
			return newSet;
		});
	};

	return (
		<>
			{/* tracking form */}
			<TrackingForm
				isTracking={isTracking}
				setIsTracking={setIsTracking}
				setTrackingData={setTrackingData}
			/>

			{/*  Tracking Result */}
			{trackingData && (
				<TrackingResult
					trackingData={trackingData}
					expandedContainers={expandedContainers}
				/>
			)}
		</>
	);
};
export default Track;
