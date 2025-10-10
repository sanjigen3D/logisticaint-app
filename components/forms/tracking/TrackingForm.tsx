import { Controller, useForm } from 'react-hook-form';
import { Naviera, TrackingFormData } from '@/lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackingSchema } from '@/lib/validations/schemas';
import { fetchTrackingData } from '@/lib/trackHelpers';
import { Dispatch, SetStateAction } from 'react';
import { UnifiedTrackingData } from '@/lib/types/unifiedInterfaces';
import { CARRIERS } from '@/lib/constants';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	StyleSheet,
} from 'react-native';
import { Search, Ship } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const TrackingForm = ({
	isTracking,
	setIsTracking,
	setTrackingData,
}: {
	isTracking: boolean;
	setIsTracking: Dispatch<SetStateAction<boolean>>;
	setTrackingData: Dispatch<SetStateAction<UnifiedTrackingData | null>>;
}) => {
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

	// inputs subscription
	const [_, selectedCarrier] = watch(['trackingNumber', 'carrier']);

	const handleTrack = async (formData: TrackingFormData) => {
		setIsTracking(true);
		try {
			const result = await fetchTrackingData(
				formData.carrier,
				formData.trackingNumber,
			);
			setTrackingData(result);
		} catch (e) {
			console.error('Error fetching tracking data:', e);
		} finally {
			setIsTracking(false);
		}
	};

	const handleCarrierSelect = (carrierId: Naviera) => {
		setValue('carrier', carrierId, { shouldValidate: true });
	};

	const getSelectedCarrier = () => {
		return CARRIERS.find((carrier) => carrier.id === selectedCarrier);
	};

	return (
		<View style={styles.formContainer}>
			{/* FORM CONTAINER */}
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
													value === carrier.id && styles.carrierNameSelected,
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

				{/* INPUT TRACKING NUMBER */}

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
					style={[styles.trackButton, !isValid && styles.trackButtonDisabled]}
					onPress={handleSubmit(handleTrack)}
					disabled={!isValid || isTracking}
					activeOpacity={0.8}
				>
					<LinearGradient
						colors={!isValid ? ['#94a3b8', '#64748b'] : ['#07174c', '#0b3477']}
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
	);
};

const styles = StyleSheet.create({
	formContainer: {
		width: '100%',
		maxWidth: 1024,
		alignSelf: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	formCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 24,
		boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
});
