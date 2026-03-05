import LocationInput from '@/components/forms/itinery/LocationInput';
import { FormData } from '@/lib/types/types';
import { formSchema } from '@/lib/validations/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import {
	ActivityIndicator,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

const PortSearchForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isLoading },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		mode: 'onChange', // Validate on every change for instant UI feedback
		defaultValues: {
			origin: {
				name: '',
				country: '',
				location: '',
			},
			destination: {
				name: '',
				country: '',
				location: '',
			},
		},
	});

	const onSubmit = (data: FormData) => {
		router.push({
			pathname: '/itineraries',
			params: {
				origin: data.origin.name,
				originCountry: data.origin.country,
				oriLocation: data.origin.location,
				destination: data.destination.name,
				destinationCountry: data.destination.country,
				destLocation: data.destination.location,
			},
		});
	};

	return (
		<View style={styles.cardShadow}>
			<View style={styles.header}>
				<Text style={styles.title}>Buscar Itinerario</Text>
				<Text style={styles.subtitle}>Encuentra las mejores rutas portuarias</Text>
			</View>

			<View style={[styles.formContainer, { zIndex: 10, elevation: 10 }]}>
				{/* Origen */}
				<View style={{ zIndex: 10, elevation: 10 }}>
					<LocationInput
						control={control}
						name="origin"
						placeholder="Puerto de origen"
						iconColor="#3b82f6"
						error={errors.origin}
					/>
				</View>

				{/* Destino */}
				{/* zIndex menor para no tapar los resultados del origen */}
				<View style={{ zIndex: 5, elevation: 5 }}>
					<LocationInput
						control={control}
						name="destination"
						placeholder="Puerto de destino"
						iconColor="#ef4444"
						error={errors.destination}
					/>
				</View>
			</View>

			<Pressable
				style={({ pressed }) => [
					styles.buttonBase,
					!isValid && styles.buttonDisabled,
					pressed && isValid && styles.buttonPressed,
				]}
				onPress={handleSubmit(onSubmit)}
				disabled={!isValid}
			>
				<LinearGradient
					colors={isValid ? ['#0f172a', '#1e293b'] : ['#cbd5e1', '#94a3b8']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.searchButtonGradient}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="#ffffff" />
					) : (
						<>
							<Search size={20} color="#ffffff" strokeWidth={2.5} />
							<Text style={styles.searchButtonText}>Buscar</Text>
						</>
					)}
				</LinearGradient>
			</Pressable>
		</View>
	);
};

export default PortSearchForm;

const styles = StyleSheet.create({
	cardShadow: {
		backgroundColor: '#ffffff',
		borderRadius: 24,
		padding: 24,
		...Platform.select({
			ios: {
				shadowColor: '#1e293b',
				shadowOffset: { width: 0, height: 12 },
				shadowOpacity: 0.08,
				shadowRadius: 32,
			},
			android: {
				elevation: 8,
			},
		}),
		borderWidth: 1,
		borderColor: '#f8fafc',
	},
	header: {
		marginBottom: 24,
	},
	title: {
		fontFamily: 'Inter-Bold',
		fontSize: 20,
		color: '#0f172a',
		letterSpacing: -0.5,
		marginBottom: 4,
	},
	subtitle: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: '#64748b',
		letterSpacing: 0.2,
	},
	formContainer: {
		gap: 16, // Espaciado entre inputs
		marginBottom: 28,
	},
	buttonBase: {
		borderRadius: 16,
		overflow: 'hidden',
		zIndex: 1,
		elevation: 1,
		marginTop: 8,
		...Platform.select({
			ios: {
				shadowColor: '#3b82f6',
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.2,
				shadowRadius: 16,
			},
			android: {
				elevation: 4,
			},
		}),
	},
	buttonPressed: {
		transform: [{ scale: 0.98 }],
	},
	buttonDisabled: {
		opacity: 0.8,
		shadowOpacity: 0,
		elevation: 0,
	},
	searchButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 18,
		paddingHorizontal: 24,
		gap: 10,
	},
	searchButtonText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
		letterSpacing: 0.5,
	},
});
