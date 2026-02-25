import { CARRIERS } from '@/lib/constants';
import { fetchTrackingData } from '@/lib/trackHelpers';
import { Naviera, TrackingFormData } from '@/lib/types/types';
import { UnifiedTrackingData } from '@/lib/types/unifiedInterfaces';
import { trackingSchema } from '@/lib/validations/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Ship } from 'lucide-react-native';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

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
		borderRadius: 24,
		padding: 24,
		// Modern shadow
		shadowColor: '#0f172a',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 16,
		elevation: 6,
		borderWidth: 1,
		borderColor: '#f1f5f9',
	},
	formTitle: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#0f172a',
		marginBottom: 24,
		letterSpacing: 0.2,
	},
	inputWrapper: {
		marginBottom: 18,
	},
	inputContainer: {
		backgroundColor: '#f8fafc',
		borderRadius: 14,
		borderWidth: 1.5,
		borderColor: '#e2e8f0',
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	inputContainerError: {
		borderColor: '#ef4444',
		backgroundColor: '#fef2f2',
	},
	textInput: {
		fontSize: 15,
		fontFamily: 'Inter-Regular',
		color: '#0f172a',
	},
	errorText: {
		fontSize: 13,
		fontFamily: 'Inter-Regular',
		color: '#ef4444',
		marginTop: 6,
		marginLeft: 4,
	},
	inputLabel: {
		fontSize: 13,
		fontFamily: 'Inter-SemiBold',
		color: '#475569',
		marginBottom: 10,
		letterSpacing: 0.3,
		textTransform: 'uppercase',
	},
	radioGroupContainer: {
		gap: 10,
	},
	radioOption: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 16,
		borderWidth: 1.5,
		borderColor: '#e2e8f0',
		padding: 14,
	},
	radioOptionSelected: {
		borderColor: '#1e40af',
		backgroundColor: '#eff6ff',
	},
	radioButton: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#cbd5e1',
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
		backgroundColor: '#1e40af',
	},
	carrierIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 14,
	},
	carrierContent: {
		flex: 1,
	},
	carrierName: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#0f172a',
		marginBottom: 2,
	},
	carrierNameSelected: {
		color: '#1e40af',
	},
	carrierDescription: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	examplesContainer: {
		marginTop: 14,
		marginBottom: 8,
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		padding: 12,
	},
	examplesTitle: {
		fontSize: 12,
		fontFamily: 'Inter-SemiBold',
		color: '#64748b',
		marginBottom: 10,
		letterSpacing: 0.4,
		textTransform: 'uppercase',
	},
	exampleItem: {
		backgroundColor: '#ffffff',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 6,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	exampleText: {
		fontSize: 13,
		fontFamily: 'Inter-Medium',
		color: '#1e40af',
		letterSpacing: 0.5,
	},
	trackButton: {
		marginTop: 24,
		borderRadius: 16,
		overflow: 'hidden',
	},
	trackButtonDisabled: {
		opacity: 0.55,
	},
	trackButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 17,
		paddingHorizontal: 24,
		gap: 8,
	},
	trackButtonText: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
		letterSpacing: 0.3,
	},
});
