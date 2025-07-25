import { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
	Package,
	Search,
	MapPin,
	Clock,
	CircleCheck as CheckCircle,
	Ship,
	Box,
	Calendar,
	Anchor,
	ChevronDown,
	ChevronUp,
} from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { UnifiedTrackingData } from '@/lib/types/unifiedInterfaces';
import { TrackingFormData } from '@/lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackingSchema } from '@/lib/validations/schemas';
import { convertZimToUnified } from '@/lib/mappers/ZimMapper';
import { convertHapagToUnified } from '@/lib/mappers/HapagMapper';
import {
	hapagTrackingResult200,
	zimTracingResult200,
} from '@/assets/DUMMY/data';
import { formatDate } from '@/lib/utils';
import Navbar from '@/components/UI/navbar';
import { CARRIERS } from '@/lib/constants';

export const Track = () => {
	const [isTracking, setIsTracking] = useState(false);
	const [trackingData, setTrackingData] = useState<UnifiedTrackingData | null>(
		null,
	);
	const [expandedContainers, setExpandedContainers] = useState<Set<string>>(
		new Set(),
	);
	const [showCarrierDropdown, setShowCarrierDropdown] = useState(false);

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isValid },
	} = useForm<TrackingFormData>({
		resolver: zodResolver(trackingSchema),
		mode: 'onChange',
		defaultValues: {
			trackingNumber: '',
			carrier: undefined,
		},
	});

	// subscripción a los input
	const [trackingNumber, selectedCarrier] = watch([
		'trackingNumber',
		'carrier',
	]);

	const handleTrack = async (data: TrackingFormData) => {
		setIsTracking(true);
		setShowCarrierDropdown(false);

		// Simular API call
		setTimeout(() => {
			setIsTracking(false);

			// Usar la naviera seleccionada por el usuario
			let unifiedData: UnifiedTrackingData;

			if (data.carrier === 'zim') {
				unifiedData = convertZimToUnified(
					zimTracingResult200,
					data.trackingNumber,
				);
			} else {
				unifiedData = convertHapagToUnified(
					hapagTrackingResult200,
					data.trackingNumber,
				);
			}
			// } else if (data.carrier === 'hapag') {
			// 	unifiedData = convertHapagToUnified(
			// 		hapagTrackingResult200,
			// 		data.trackingNumber,
			// 	);

			setTrackingData(unifiedData);
		}, 1500);
	};

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

	const handleCarrierSelect = (carrierId: 'hapag' | 'zim') => {
		setValue('carrier', carrierId, { shouldValidate: true });
		setShowCarrierDropdown(false);
	};

	const getSelectedCarrier = () => {
		return CARRIERS.find((carrier) => carrier.id === selectedCarrier);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<Navbar
					title={'Rastrear Envío'}
					subtitle={'Sigue tu paquete en tiempo real'}
					icon={<Package size={32} color="#ffffff" />}
				/>
			</ScrollView>

			{/* MAIN CONTAINER */}
			<View style={styles.mainContainer}>
				{/* FORM CONTAINER */}
				<View style={styles.formContainer}></View>
			</View>
		</KeyboardAvoidingView>
	);
};
export default Track;

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
		paddingTop: Platform.OS === 'ios' ? 60 : 40,
		paddingBottom: 40,
	},
	headerContainer: {
		width: '100%',
		maxWidth: 1200,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	headerContent: {
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 28,
		fontFamily: 'Inter-Bold',
		color: '#ffffff',
		marginTop: 8,
	},
	headerSubtitle: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#a7f3d0',
		marginTop: 4,
		textAlign: 'center',
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 800,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	formContainer: {
		paddingTop: 20,
	},
	formCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	formTitle: {
		fontSize: 20,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 24,
		textAlign: 'center',
	},
	inputWrapper: {
		marginBottom: 16,
	},
	inputContainer: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	inputContainerError: {
		borderColor: '#ef4444',
		backgroundColor: '#fef2f2',
	},
	textInput: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#1e293b',
	},
	errorText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#ef4444',
		marginTop: 8,
		marginLeft: 4,
	},
	inputLabel: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#374151',
		marginBottom: 8,
	},
	radioGroupContainer: {
		gap: 12,
	},
	radioOption: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		padding: 16,
	},
	radioOptionSelected: {
		borderColor: '#3b82f6',
		backgroundColor: '#f0f9ff',
	},
	radioButton: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#d1d5db',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	radioButtonInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: 'transparent',
	},
	radioButtonInnerSelected: {
		backgroundColor: '#3b82f6',
	},
	carrierIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	carrierContent: {
		flex: 1,
	},
	carrierName: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 2,
	},
	carrierNameSelected: {
		color: '#1e40af',
	},
	carrierDescription: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	examplesContainer: {
		marginTop: 12,
		marginBottom: 8,
	},
	examplesTitle: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#374151',
		marginBottom: 8,
	},
	exampleItem: {
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 4,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	exampleText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#3b82f6',
	},
	trackButton: {
		marginTop: 24,
		borderRadius: 12,
		overflow: 'hidden',
	},
	trackButtonDisabled: {
		opacity: 0.6,
	},
	trackButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	trackButtonText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
		marginLeft: 8,
	},
	resultsCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 24,
		marginTop: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	resultsTitle: {
		fontSize: 20,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
	},
	statusContainer: {
		alignItems: 'center',
		marginBottom: 24,
	},
	statusBadge: {
		backgroundColor: '#dcfce7',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	statusText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#16a34a',
	},
	routeContainer: {
		marginBottom: 24,
	},
	routeItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	routeText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		marginLeft: 12,
		flex: 1,
	},
	sectionTitle: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
		marginTop: 24,
	},
	routeDetailsContainer: {
		marginTop: 24,
	},
	routeDetailCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	routeDetailHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	vesselName: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginLeft: 8,
		flex: 1,
	},
	voyageNumber: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		backgroundColor: '#e2e8f0',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	routeDetailContent: {
		marginLeft: 24,
	},
	routeDetailText: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#475569',
		marginBottom: 4,
	},
	routeDetailDates: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	containersContainer: {
		marginTop: 24,
	},
	containerCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		marginBottom: 12,
		overflow: 'hidden',
	},
	containerHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	containerHeaderContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	containerNumber: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginLeft: 8,
		flex: 1,
	},
	containerType: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		backgroundColor: '#e2e8f0',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	containerEvents: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	containerEvent: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	eventIcon: {
		width: 20,
		height: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		backgroundColor: '#f1f5f9',
		marginTop: 2,
	},
	eventIconCompleted: {
		backgroundColor: '#dcfce7',
	},
	eventIconEmpty: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#cbd5e1',
	},
	containerEventContent: {
		flex: 1,
	},
	containerEventStatus: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#1e293b',
		marginBottom: 2,
	},
	containerEventLocation: {
		fontSize: 13,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		marginBottom: 2,
	},
	containerEventDate: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginBottom: 2,
	},
	containerEventVessel: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	timelineTitle: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
	},
	timelineItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	timelineIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		backgroundColor: '#f1f5f9',
	},
	timelineIconCompleted: {
		backgroundColor: '#dcfce7',
	},
	timelineIconEmpty: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#cbd5e1',
	},
	timelineContent: {
		flex: 1,
	},
	timelineStatus: {
		fontSize: 16,
		fontFamily: 'Inter-Medium',
		color: '#64748b',
		marginBottom: 4,
	},
	timelineStatusCompleted: {
		color: '#1e293b',
	},
	timelineLocation: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		marginBottom: 4,
	},
	timelineDetails: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	timelineDate: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginLeft: 4,
	},
	timelineVessel: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginBottom: 2,
	},
	timelineContainer: {
		marginTop: 24,
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	carrierContainer: {
		marginBottom: 16,
	},
	trackingNumber: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
});
