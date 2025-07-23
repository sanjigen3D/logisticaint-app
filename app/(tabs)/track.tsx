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
	ChevronDown,
	ChevronUp,
	Anchor,
} from 'lucide-react-native';
import { useForm } from 'react-hook-form';
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

// Carrier options
const CARRIERS = [
	{
		id: 'hapag' as const,
		name: 'Hapag-Lloyd',
		description: 'Números como HLCUGDN0000000',
		color: '#ef4444',
		examples: ['HLCUGDN0000000', 'HLCU1234567890'],
	},
	{
		id: 'zim' as const,
		name: 'ZIM Integrated Shipping',
		description: 'Números como ZIMUNNJ1011275',
		color: '#3b82f6',
		examples: ['ZIMUNNJ1011275', 'ZIM1234567890'],
	},
];

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

	const renderCarrierOption = ({ item }: { item: (typeof CARRIERS)[0] }) => (
		<TouchableOpacity
			style={styles.carrierOption}
			onPress={() => handleCarrierSelect(item.id)}
			activeOpacity={0.7}
		>
			<View
				style={[
					styles.carrierOptionIcon,
					{ backgroundColor: `${item.color}20` },
				]}
			>
				<Anchor size={20} color={item.color} />
			</View>
			<View style={styles.carrierOptionContent}>
				<Text style={styles.carrierOptionName}>{item.name}</Text>
				<Text style={styles.carrierOptionDescription}>{item.description}</Text>
			</View>
		</TouchableOpacity>
	);

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
				<LinearGradient colors={['#07174c', '#0b3477']} style={styles.header}>
					<View style={styles.headerContainer}>
						<View style={styles.headerContent}>
							<Package size={32} color="#ffffff" />
							<Text style={styles.headerTitle}>Rastrear Envío</Text>
							<Text style={styles.headerSubtitle}>
								Sigue tu paquete en tiempo real
							</Text>
						</View>
					</View>
				</LinearGradient>
			</ScrollView>
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
		color: '#bfdbfe',
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
	trackButton: {
		marginTop: 16,
		borderRadius: 12,
		overflow: 'hidden',
	},
	inputLabel: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#374151',
		marginBottom: 8,
	},
	carrierInputWrapper: {
		position: 'relative',
	},
	carrierSelector: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	carrierSelectorActive: {
		borderColor: '#3b82f6',
		backgroundColor: '#f0f9ff',
	},
	selectedCarrierContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	selectedCarrierIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	selectedCarrierText: {
		fontSize: 16,
		fontFamily: 'Inter-Medium',
		color: '#1e293b',
	},
	carrierPlaceholder: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		flex: 1,
	},
	carrierChevron: {
		transform: [{ rotate: '0deg' }],
	},
	carrierChevronRotated: {
		transform: [{ rotate: '180deg' }],
	},
	carrierDropdown: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: '#ffffff',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 15,
		zIndex: 9999,
		maxHeight: 200,
	},
	carrierList: {
		maxHeight: 200,
	},
	carrierOption: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	carrierOptionIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	carrierOptionContent: {
		flex: 1,
	},
	carrierOptionName: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 2,
	},
	carrierOptionDescription: {
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
	carrierContainer: {
		marginBottom: 16,
	},
	carrierName: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#3b82f6',
		marginBottom: 4,
	},
	trackingNumber: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
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
	timelineContainer: {
		marginTop: 24,
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
});
