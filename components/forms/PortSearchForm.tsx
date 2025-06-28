import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import useDebounce from '../../lib/useDebounce';
import { Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Port, FormData } from '@/lib/types';
import LocationInput from '@/components/forms/LocationInput';
import { formSchema } from '@/lib/validations/schemas';

const PortSearchForm = () => {
	const {
		control,
		handleSubmit,
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
	const [originQuery, setOriginQuery] = useState('');
	const [destinationQuery, setDestinationQuery] = useState('');
	const [originSuggestions, setOriginSuggestions] = useState<Port[]>([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState<Port[]>(
		[],
	);
	const [loadingOrigin, setLoadingOrigin] = useState(false);
	const [loadingDestination, setLoadingDestination] = useState(false);
	const debouncedOrigin = useDebounce(originQuery, 400);
	const debouncedDestination = useDebounce(destinationQuery, 400);

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
				};
			});
		} catch {
			return [];
		}
	};

	// Efectos para buscar sugerencias
	useEffect(() => {
		if (debouncedOrigin.length >= 3) {
			setLoadingOrigin(true);
			fetchPorts(debouncedOrigin).then((results) => {
				setOriginSuggestions(results);
				setLoadingOrigin(false);
			});
		} else {
			setOriginSuggestions([]);
		}
	}, [debouncedOrigin]);

	useEffect(() => {
		if (debouncedDestination.length >= 3) {
			setLoadingDestination(true);
			fetchPorts(debouncedDestination).then((results) => {
				setDestinationSuggestions(results);
				setLoadingDestination(false);
			});
		} else {
			setDestinationSuggestions([]);
		}
	}, [debouncedDestination]);

	const onSubmit = (data: FormData) => {
		router.push({
			pathname: '/itineraries',
			params: {
				origin: data.origin.name,
				originCountry: data.origin.country,
				destination: data.destination.country + ',' + data.destination.name,
				destinationCountry: data.destination.country,
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
					placeholder="San Antonio, Chile"
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
					placeholder="Shanghai, China"
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
					colors={isValid ? ['#1e40af', '#3b82f6'] : ['#94a3b8', '#64748b']}
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
