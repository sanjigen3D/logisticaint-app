import useDebounce from '@/lib/hooks/useDebounce';
import { FormData, Port } from '@/lib/types/types';
import { MapPin, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
	Controller,
	FieldError,
	FieldErrorsImpl,
	Merge,
	useWatch,
	type Control,
} from 'react-hook-form';
import {
	ActivityIndicator,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import SuggestionsModal from './SuggestModal';

type LocationInputProps = {
	control: Control<FormData>;
	name: 'origin' | 'destination';
	placeholder: string;
	iconColor: string;
	error?:
	| FieldError
	| Merge<FieldError, FieldErrorsImpl<{ name: string; country: string }>>
	| undefined;
};

const LocationInput = ({
	control,
	name,
	placeholder,
	iconColor,
	error,
}: LocationInputProps) => {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 600);
	const [suggestions, setSuggestions] = useState<Port[]>([]);
	const [loading, setLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const currentValue = useWatch({ control, name });

	// Efecto para buscar puertos aislado en el input
	useEffect(() => {
		let isActive = true;

		// Si ya hay un pais seleccionado y el query de busqueda actual coincide con
		// el nombre de ese puerto seleccionado, entonces no gatillar un re-fetch.
		if (currentValue?.country && debouncedQuery === currentValue?.name) {
			setSuggestions([]);
			setLoading(false);
			return;
		}

		if (!debouncedQuery || debouncedQuery.length < 3) {
			setSuggestions([]);
			setLoading(false);
			return;
		}

		const fetchPorts = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`https://marines-services.vercel.app/portSearch?name=${encodeURIComponent(
						debouncedQuery.toLowerCase()
					)}`
				);
				if (!res.ok) {
					if (isActive) {
						setSuggestions([]);
						setLoading(false);
					}
					return;
				}
				const data: Port[] = await res.json();
				if (isActive) {
					const mapped = data.map((port) => ({
						name: port.name,
						country: port.country,
						location: port.location,
					}));
					setSuggestions(mapped);
					setLoading(false);
					setShowSuggestions(true);
				}
			} catch {
				if (isActive) {
					setSuggestions([]);
					setLoading(false);
				}
			}
		};

		fetchPorts();

		return () => {
			isActive = false;
		};
	}, [debouncedQuery]);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value } }) => {
				// Sincronizar query local con el valor inicial o si cambia desde afuera
				useEffect(() => {
					if (value.name && query === '') {
						setQuery(value.name);
					}
				}, [value.name]);

				const isSelected = !!value.country; // Si hay pais, es que esta formalmente seleccionado un puerto

				return (
					<View style={styles.container}>
						<View
							style={[
								styles.inputWrapper,
								error ? styles.inputWrapperError : null,
								isSelected && !error ? styles.inputWrapperSelected : null,
							]}
						>
							<View style={styles.iconWrap}>
								<MapPin size={20} color={iconColor} strokeWidth={2.5} />
							</View>
							<TextInput
								style={[styles.textInput, isSelected && styles.textInputSelected]}
								onChangeText={(text) => {
									setQuery(text);
									setShowSuggestions(true);
									// Si el usuario edita, limpiar la seleccion estricta global
									if (value.country !== '') {
										onChange({ name: text, country: '', location: '' });
									} else {
										onChange({ ...value, name: text });
									}
									if (!text) setSuggestions([]);
								}}
								value={query}
								placeholder={placeholder}
								placeholderTextColor="#94a3b8"
								autoCorrect={false}
								autoCapitalize="none"
							/>

							{loading && (
								<ActivityIndicator size="small" color={iconColor} style={styles.rightIcon} />
							)}

							{/* Boton para limpiar */}
							{!loading && query.length > 0 && (
								<Pressable
									style={styles.rightIcon}
									onPress={() => {
										setQuery('');
										setSuggestions([]);
										setShowSuggestions(false);
										onChange({ name: '', country: '', location: '' });
									}}
								>
									<X size={18} color="#94a3b8" strokeWidth={2.5} />
								</Pressable>
							)}
						</View>

						{error && (
							<Text style={styles.errorText}>
								{error.message?.toString()}
							</Text>
						)}

						{/* Modal o Lista de sugerencias */}
						{showSuggestions && suggestions.length > 0 && (
							<View style={styles.suggestionsContainer}>
								<SuggestionsModal
									suggestions={suggestions}
									onSelectItem={(item: Port) => {
										onChange(item); // Registrar en hook-form global
										setQuery(item.name); // Actualizar UI local
										setSuggestions([]);
										setShowSuggestions(false);
									}}
									iconColor={iconColor}
								/>
							</View>
						)}
					</View>
				);
			}}
		/>
	);
};

export default LocationInput;

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		zIndex: 1, // Necesario para que el dropdown flote sobre otros inputs
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 16,
		borderWidth: 1.5,
		borderColor: '#f1f5f9',
		paddingVertical: Platform.OS === 'ios' ? 16 : 14,
		paddingHorizontal: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.03,
		shadowRadius: 2,
		elevation: 1,
	},
	inputWrapperError: {
		borderColor: '#fecaca',
		backgroundColor: '#fef2f2',
	},
	inputWrapperSelected: {
		borderColor: '#e2e8f0',
		backgroundColor: '#ffffff',
	},
	iconWrap: {
		marginRight: 12,
	},
	textInput: {
		flex: 1,
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: '#1e293b',
		padding: 0, // Reset android padding
	},
	textInputSelected: {
		fontFamily: 'Inter-SemiBold',
		color: '#0f172a',
	},
	rightIcon: {
		marginLeft: 8,
		padding: 4,
	},
	errorText: {
		fontFamily: 'Inter-Medium',
		fontSize: 13,
		color: '#ef4444',
		marginTop: 6,
		marginLeft: 4,
	},
	suggestionsContainer: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		marginTop: 8,
		backgroundColor: '#ffffff',
		borderRadius: 16,
		...Platform.select({
			ios: {
				shadowColor: '#0f172a',
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.1,
				shadowRadius: 24,
			},
			android: {
				elevation: 12,
			},
		}),
		borderWidth: 1,
		borderColor: '#f1f5f9',
		zIndex: 999,
		overflow: 'hidden',
		maxHeight: 250,
	},
});
