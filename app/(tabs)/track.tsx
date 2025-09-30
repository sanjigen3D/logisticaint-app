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
import { ROUTES } from '@/lib/Routes';

type Naviera = 'Zim' | 'Hapag' | 'Maersk';

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

	// subscripción de los input
	const [trackingNumber, selectedCarrier] = watch([
		'trackingNumber',
		'carrier',
	]);

	const getTrackingUrl = (carrier: Naviera, trackingNumber: string) => {
		switch (carrier) {
			case 'Zim':
				return `${ROUTES.API_ROUTE}/tracking/Zim?trackingNumber=${trackingNumber}`;
			case 'Hapag':
				return `${ROUTES.API_ROUTE}/tracking/Hapag?trackingNumber=${trackingNumber}`;
			case 'Maersk':
				return `${ROUTES.API_ROUTE}/tracking/Maersk?trackingNumber=${trackingNumber}`;
		}
	};
	const handleTrack = async (data: TrackingFormData) => {
		setIsTracking(true);
		setShowCarrierDropdown(false);
		let unifiedData: UnifiedTrackingData;

		const url = getTrackingUrl(data.carrier, data.trackingNumber);

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status !== 200) {
				// respuesta fallida aquí puedo mostrar algo
				console.error('Error fetching tracking data:', response.statusText);
				return;
			}

			const resApiData = await response.json();

			unifiedData = convertZimToUnified(resApiData, data.trackingNumber);
			setTrackingData(unifiedData);
		} catch (e) {
			console.error('Error fetching tracking data:', e);
		}
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

	const handleCarrierSelect = (carrierId: 'Hapag' | 'Zim') => {
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

				{/* MAIN CONTAINER */}
				<View style={styles.mainContainer}>
					{/* FORM CONTAINER */}
					<View style={styles.formContainer}>
						<View style={styles.formCard}>
							<Text style={styles.formTitle}>Número de seguimiento</Text>

							{/* Selección de carrier */}
							<View style={styles.inputWrapper}>
								<Text style={styles.inputLabel}>Naviera</Text>
								<Controller
									control={control}
									name="carrier"
									render={({ field: { value } }) => (
										<View style={styles.radioGroupContainer}>
											{CARRIERS.map((carrier) => (
												<TouchableOpacity
													key={carrier.id}
													style={[
														styles.radioOption,
														value === carrier.id && styles.radioOptionSelected,
													]}
													onPress={() => handleCarrierSelect(carrier.id)}
													activeOpacity={0.7}
												>
													<View style={styles.radioButton}>
														<View
															style={[
																styles.radioButtonInner,
																value === carrier.id &&
																	styles.radioButtonInnerSelected,
																value === carrier.id && {
																	backgroundColor: carrier.color,
																},
															]}
														/>
													</View>
													<View
														style={[
															styles.carrierIconContainer,
															{ backgroundColor: `${carrier.color}20` },
														]}
													>
														<Ship size={20} color={carrier.color} />
													</View>
													<View style={styles.carrierContent}>
														<Text
															style={[
																styles.carrierName,
																value === carrier.id &&
																	styles.carrierNameSelected,
															]}
														>
															{carrier.name}
														</Text>
														<Text style={styles.carrierDescription}>
															{carrier.description}
														</Text>
													</View>
												</TouchableOpacity>
											))}
										</View>
									)}
								/>
								{errors.carrier && (
									<Text style={styles.errorText}>{errors.carrier.message}</Text>
								)}
							</View>

							{/* Tracking Number Input */}

							<Controller
								control={control}
								name="trackingNumber"
								render={({ field: { onChange, onBlur, value } }) => (
									<View style={styles.inputWrapper}>
										<Text style={styles.inputLabel}>Número de Seguimiento</Text>
										<View
											style={[
												styles.inputContainer,
												errors.trackingNumber && styles.inputContainerError,
											]}
										>
											<TextInput
												style={styles.textInput}
												placeholder={
													selectedCarrier
														? `Ej: ${getSelectedCarrier()?.examples[0]}`
														: 'Selecciona una naviera primero'
												}
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												placeholderTextColor="#64748b"
												autoCapitalize="characters"
												editable={!!selectedCarrier}
											/>
										</View>
										{errors.trackingNumber && (
											<Text style={styles.errorText}>
												{errors.trackingNumber.message}
											</Text>
										)}
									</View>
								)}
							/>
							{/* Examples */}
							{selectedCarrier && (
								<View style={styles.examplesContainer}>
									<Text style={styles.examplesTitle}>
										Ejemplos de números válidos:
									</Text>
									{getSelectedCarrier()?.examples.map((example, index) => (
										<TouchableOpacity
											key={index}
											style={styles.exampleItem}
											onPress={() =>
												setValue('trackingNumber', example, {
													shouldValidate: true,
												})
											}
											activeOpacity={0.7}
										>
											<Text style={styles.exampleText}>{example}</Text>
										</TouchableOpacity>
									))}
								</View>
							)}

							{/* SUBMIT BUTTON */}
							<TouchableOpacity
								style={[
									styles.trackButton,
									!isValid && styles.trackButtonDisabled,
								]}
								onPress={handleSubmit(handleTrack)}
								disabled={!isValid || isTracking}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={
										!isValid ? ['#94a3b8', '#64748b'] : ['#07174c', '#0b3477']
									}
									style={styles.trackButtonGradient}
								>
									<Search size={20} color="#ffffff" />
									<Text style={styles.trackButtonText}>
										{isTracking ? 'Rastreando...' : 'Rastrear'}
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</View>
					{/*  Tracking Result */}
					{trackingData && (
						<View style={styles.resultsCard}>
							<Text style={styles.resultsTitle}>Estado del Envío</Text>

							{/* Carrier Info */}
							<View style={styles.carrierContainer}>
								<Text style={styles.carrierName}>{trackingData.carrier}</Text>
								<Text style={styles.trackingNumber}>
									{trackingData.trackingNumber}
								</Text>
							</View>

							{/* Status Bar */}
							<View style={styles.statusContainer}>
								<View style={styles.statusBadge}>
									<Text style={styles.statusText}>{trackingData.status}</Text>
								</View>
							</View>

							{/* ORIGEN - DESTINO - FECHA LLEGADA */}
							<View style={styles.routeContainer}>
								<View style={styles.routeItem}>
									<MapPin size={16} color="#10b981" />
									<Text style={styles.routeText}>
										Origen: {trackingData.origin}
									</Text>
								</View>
								<View style={styles.routeItem}>
									<MapPin size={16} color="#ef4444" />
									<Text style={styles.routeText}>
										Destino: {trackingData.destination}
									</Text>
								</View>
								<View style={styles.routeItem}>
									<Clock size={16} color="#3b82f6" />
									<Text style={styles.routeTextDate}>
										Llegada estimada: {trackingData.estimatedArrival}
									</Text>
								</View>
							</View>

							{/* Route Details (for ZIM) */}
							{trackingData.routeDetails && (
								<View style={styles.routeDetailsContainer}>
									<Text style={styles.sectionTitle}>Detalles de la Ruta</Text>
									{trackingData.routeDetails.map((route, index) => (
										<View key={index} style={styles.routeDetailCard}>
											<View style={styles.routeDetailHeader}>
												<Ship size={16} color="#3b82f6" />
												<Text style={styles.vesselName}>{route.vessel}</Text>
												<Text style={styles.voyageNumber}>
													Voyage: {route.voyage}
												</Text>
											</View>
											<View style={styles.routeDetailContent}>
												<Text style={styles.routeDetailText}>
													{route.from} → {route.to}
												</Text>
												<Text style={styles.routeDetailDates}>
													{formatDate(route.departure)} -{' '}
													{formatDate(route.arrival)}
												</Text>
											</View>
										</View>
									))}
								</View>
							)}

							{/* Timeline */}
							<View style={styles.timelineContainer}>
								<Text style={styles.timelineTitle}>
									Historial de Seguimiento
								</Text>
								{trackingData.events.map((event) => (
									<View key={event.id} style={styles.timelineItem}>
										<View
											style={[
												styles.timelineIcon,
												event.completed && styles.timelineIconCompleted,
											]}
										>
											{event.completed ? (
												<CheckCircle size={16} color="#10b981" />
											) : (
												<View style={styles.timelineIconEmpty} />
											)}
										</View>
										<View style={styles.timelineContent}>
											<Text
												style={[
													styles.timelineStatus,
													event.completed && styles.timelineStatusCompleted,
												]}
											>
												{event.status}
											</Text>
											<Text style={styles.timelineLocation}>
												{event.location}
											</Text>
											<View style={styles.timelineDetails}>
												<Calendar size={12} color="#64748b" />
												<Text style={styles.timelineDate}>
													{formatDate(event.date)}
												</Text>
											</View>
											{event.vessel && (
												<Text style={styles.timelineVessel}>
													Barco: {event.vessel}{' '}
													{event.voyage && `- Voyage: ${event.voyage}`}
												</Text>
											)}
											{event.containerNumber && (
												<Text style={styles.timelineContainer}>
													Contenedor: {event.containerNumber}
												</Text>
											)}
										</View>
									</View>
								))}
							</View>

							{/* Container Information (for ZIM) */}
							{trackingData.containers &&
								trackingData.containers.length > 0 && (
									<View style={styles.containersContainer}>
										<Text style={styles.sectionTitle}>
											Contenedores ({trackingData.containers.length})
										</Text>
										{trackingData.containers.map((container) => (
											<View key={container.number} style={styles.containerCard}>
												<TouchableOpacity
													style={styles.containerHeader}
													onPress={() =>
														toggleContainerExpansion(container.number)
													}
													activeOpacity={0.7}
												>
													<View style={styles.containerHeaderContent}>
														<Box size={16} color="#3b82f6" />
														<Text style={styles.containerNumber}>
															{container.number}
														</Text>
														<Text style={styles.containerType}>
															{container.type}
														</Text>
													</View>
													{expandedContainers.has(container.number) ? (
														<ChevronUp size={16} color="#64748b" />
													) : (
														<ChevronDown size={16} color="#64748b" />
													)}
												</TouchableOpacity>

												{expandedContainers.has(container.number) && (
													<View style={styles.containerEvents}>
														{container.events.map((event) => (
															<View
																key={event.id}
																style={styles.containerEvent}
															>
																<View
																	style={[
																		styles.eventIcon,
																		event.completed &&
																			styles.eventIconCompleted,
																	]}
																>
																	{event.completed ? (
																		<CheckCircle size={12} color="#10b981" />
																	) : (
																		<View style={styles.eventIconEmpty} />
																	)}
																</View>
																<View style={styles.containerEventContent}>
																	<Text style={styles.containerEventStatus}>
																		{event.status}
																	</Text>
																	<Text style={styles.containerEventLocation}>
																		{event.location}
																	</Text>
																	<Text style={styles.containerEventDate}>
																		{formatDate(event.date)}
																	</Text>
																	{event.vessel && (
																		<Text style={styles.containerEventVessel}>
																			Barco: {event.vessel} - Voyage:{' '}
																			{event.voyage}
																		</Text>
																	)}
																</View>
															</View>
														))}
													</View>
												)}
											</View>
										))}
									</View>
								)}
						</View>
					)}
				</View>
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
		color: '#a7f3d0',
		marginTop: 4,
		textAlign: 'center',
	},
	mainContainer: {
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
	routeTextDate: {
		fontSize: 14,
		fontFamily: 'Inter-Bold',
		color: '#403838',
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
		fontSize: 14,
		fontFamily: 'Inter-SemiBold',
		color: '#475569',
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
