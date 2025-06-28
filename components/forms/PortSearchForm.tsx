import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { z } from 'zod';
import useDebounce from '../../lib/useDebounce';
import { Anchor, MapPin, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const formSchema = z.object({
	origin: z.string().min(3, {
		message: 'El origen debe tener al menos 3 caracteres.',
	}),
	destination: z.string().min(3, {
		message: 'El destino debe tener al menos 3 caracteres.',
	}),
});

type FormData = z.infer<typeof formSchema>;

const PortSearchForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isLoading },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			origin: '',
			destination: '',
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

	// Buscar sugerencias para origen
	type Port = { name: string; country: string };

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
				origin: data.origin,
				destination: data.destination,
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
				<Controller
					control={control}
					name="origin"
					render={({ field: { onChange, value } }) => (
						<View id="originWrapper" className="relative">
							<View
								style={styles.inputWrapper}
								className="items-center bg-[#f8fafc] flex flex-row"
							>
								<View
									style={{
										marginRight: 12,
									}}
								>
									<MapPin size={20} color="#3b82f6" />
								</View>
								<TextInput
									style={{
										fontFamily: 'Inter-Regular',
										outline: 'none',
									}}
									className="flex flex-1 text-base text-[#1e293b] placeholder:text-foreground pl-4"
									onChangeText={(text) => {
										onChange(text);
										setOriginQuery(text);
									}}
									value={value}
									placeholder="San Antonio, Chile"
									autoCorrect={false}
									autoCapitalize="none"
								/>
								{loadingOrigin && (
									<ActivityIndicator size="small" color="#5a8ce8" />
								)}
							</View>
							{errors.origin && (
								<Text className="text-error font-semibold">
									{errors.origin.message}
								</Text>
							)}
							{/* AUTOCOMPLETAR ORIGEN */}
							{originSuggestions.length > 0 && (
								<FlatList
									style={styles.suggestionList}
									data={originSuggestions}
									keyExtractor={(port) => port.name + port.country}
									renderItem={({ item }) => {
										return (
											<TouchableOpacity
												onPress={() => {
													onChange(item);
													setOriginQuery(item.name + ', ' + item.country);
													setOriginSuggestions([]);
													setOriginSuggestions([]);
												}}
												style={styles.suggestionItem}
											>
												<Anchor size={16} color="#3b82f6" />
												<View style={styles.suggestionContent}>
													<Text style={styles.suggestionName}>{item.name}</Text>
													<Text style={styles.suggestionCode}>
														{item.country}
													</Text>
												</View>
											</TouchableOpacity>
										);
									}}
								/>
							)}
						</View>
					)}
				/>

				{/* Destino */}
				<Controller
					control={control}
					name="destination"
					render={({ field: { onChange, value } }) => (
						<View id="destinationWrapper" className="relative">
							<View
								style={styles.inputWrapper}
								className="items-center bg-[#f8fafc] flex flex-row"
							>
								<View style={{ marginRight: 12 }}>
									<MapPin size={20} color="#ef4444" />
								</View>
								<TextInput
									style={{
										fontFamily: 'Inter-Regular',
										outline: 'none',
									}}
									className="flex flex-1 text-base text-[#1e293b] placeholder:text-foreground pl-4"
									onChangeText={(text) => {
										onChange(text);
										setDestinationQuery(text);
									}}
									value={value}
									placeholder="Shanghai, China"
									autoCorrect={false}
									autoCapitalize="none"
								/>
								{loadingDestination && (
									<ActivityIndicator size="small" color="#5a8ce8" />
								)}
							</View>
							{destinationSuggestions.length > 0 && (
								<FlatList
									style={styles.suggestionList}
									data={destinationSuggestions}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item }) => (
										<TouchableOpacity
											onPress={() => {
												onChange(item);
												setDestinationQuery(item.name + ', ' + item.country);
												setDestinationSuggestions([]);
											}}
											style={styles.suggestionItem}
										>
											<Anchor size={16} color="#ef4444" />
											<View style={styles.suggestionContent}>
												<Text style={styles.suggestionName}>{item.name}</Text>
												<Text style={styles.suggestionCode}>
													{item.country}
												</Text>
											</View>
										</TouchableOpacity>
									)}
								/>
							)}
							{errors.destination && (
								<Text className="text-error font-semibold">
									{errors.destination.message}
								</Text>
							)}
						</View>
					)}
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
	inputWrapper: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingVertical: 14,
		paddingHorizontal: 12,
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
	suggestionsContainer: {
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
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
		zIndex: 1000,
		maxHeight: 200,
	},
	suggestionList: { maxHeight: 200 },
	suggestionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	suggestionContent: {
		marginLeft: 12,
		flex: 1,
	},
	suggestionName: {
		fontSize: 16,
		fontFamily: 'Inter-Medium',
		color: '#1e293b',
		marginBottom: 2,
	},
	suggestionCode: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
});
