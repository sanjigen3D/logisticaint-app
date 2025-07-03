import LocationInput from '@/components/forms/itinery/LocationInput';
import { FormData, Port } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import { formSchema } from '@/lib/validations/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

const PortSearchForm = () => {
	const {
		control,
		handleSubmit,
		watch,
		formState: { errors, isValid, isLoading },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			origin: {
				name: '',
				country: '',
			},
			destination: {
				name: '',
				country: '',
			},
		},
	});

	// Observar los valores actuales del formulario
	const originValue = watch('origin');
	const destinationValue = watch('destination');

	const [originQuery, setOriginQuery] = useState('');
	const [destinationQuery, setDestinationQuery] = useState('');
	const [originSuggestions, setOriginSuggestions] = useState<Port[]>([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState<Port[]>(
		[],
	);
	const [loadingOrigin, setLoadingOrigin] = useState(false);
	const [loadingDestination, setLoadingDestination] = useState(false);
	const debouncedOrigin = useDebounce(originQuery, 600);
	const debouncedDestination = useDebounce(destinationQuery, 600);

	const fetchPorts = async (query: string): Promise<Port[]> => {
		if (query.length < 3) return [];
		const newQuery = query.toLowerCase();
		try {
			const res = await fetch(
				`https://marines-services.vercel.app/portSearch?name=${encodeURIComponent(newQuery)}`,
			);
			if (!res.ok) return [];
			const data: Port[] = await res.json();

			// aquí retorno cada puerto encontrado para ser mostrado en el autocompletar
			return data.map((port) => {
				return {
					name: port.name,
					country: port.country,
					location: port.location,
				};
			});
		} catch {
			return [];
		}
	};

	// Función para verificar si la query coincide con el puerto seleccionado
	const isQueryMatchingSelectedPort = (
		query: string,
		selectedPort: Port,
	): boolean => {
		if (!query || query.length < 3) return true;
		if (!selectedPort.name || !selectedPort.country) return false;
		const fullPortName = `${selectedPort.name}, ${selectedPort.country}`;
		return (
			fullPortName.toLowerCase().includes(query.toLowerCase()) ||
			selectedPort.name.toLowerCase().includes(query.toLowerCase())
		);
	};

	// Efectos para buscar sugerencias
	useEffect(() => {
		// Solo hacer fetch si la query no coincide con el puerto ya seleccionado
		if (!isQueryMatchingSelectedPort(debouncedOrigin, originValue)) {
			setLoadingOrigin(true);
			fetchPorts(debouncedOrigin).then((results) => {
				setOriginSuggestions(results);
				setLoadingOrigin(false);
			});
		}
	}, [debouncedOrigin, originValue]);

	useEffect(() => {
		// Solo hacer fetch si la query no coincide con el puerto ya seleccionado
		if (!isQueryMatchingSelectedPort(debouncedDestination, destinationValue)) {
			setLoadingDestination(true);
			fetchPorts(debouncedDestination).then((results) => {
				setDestinationSuggestions(results);
				setLoadingDestination(false);
			});
		}
	}, [debouncedDestination, destinationValue]);

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
		<View style={styles.cardShadow} className="bg-white rounded-2xl p-6">
			<View className="text-center py-4 px-2 gap-3">
				<Text
					style={{ fontFamily: 'Inter-SemiBold' }}
					className="text-primary text-xl md:text-3xl self-center mb-6 text-center"
				>
					Buscar Itinerario
				</Text>
			</View>

			<View id="inputsWrapper" className="grid gap-6 md:grid-cols-2 mb-6">
				{/* Origen */}
				<LocationInput
					control={control}
					name="origin"
					placeholder="Origen"
					iconColor="#3b82f6"
					loading={loadingOrigin}
					suggestions={originSuggestions}
					setSuggestions={setOriginSuggestions}
					setQuery={setOriginQuery}
					error={errors.origin}
				/>

				{/* Destino */}
				<LocationInput
					control={control}
					name="destination"
					placeholder="Destino"
					iconColor="#ef4444"
					loading={loadingDestination}
					suggestions={destinationSuggestions}
					setSuggestions={setDestinationSuggestions}
					setQuery={setDestinationQuery}
					error={errors.destination}
				/>
			</View>

			<Pressable
				style={isValid ? styles.buttonActive : styles.buttonDisabled}
				className="overflow-hidden z-[1]"
				onPress={handleSubmit(onSubmit)}
				disabled={!isValid}
			>
				<LinearGradient
					colors={isValid ? ['#07174c', '#0b3477'] : ['#94a3b8', '#64748b']}
					style={styles.searchButtonGradient}
				>
					<Search size={20} color="#fff" />
					<Text style={styles.searchButtonText}>
						{isLoading ? (
							<ActivityIndicator size="small" color="#5a8ce8" />
						) : (
							'Buscar'
						)}
					</Text>
				</LinearGradient>
			</Pressable>
		</View>
	);
};
export default PortSearchForm;

const styles = StyleSheet.create({
	cardShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 16,
	},
	buttonActive: {
		borderRadius: 12,
	},
	buttonDisabled: {
		borderRadius: 12,
		opacity: 0.5,
	},
	searchButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	searchButtonText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#ffffff',
		marginLeft: 8,
	},
});
