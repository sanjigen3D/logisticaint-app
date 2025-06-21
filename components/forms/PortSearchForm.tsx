import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { z } from "zod";
import useDebounce from "../../lib/useDebounce";
import {MapPin} from "lucide-react-native"

const formSchema = z.object({
	origin: z.string().min(3, {
		message: "El origen debe tener al menos 3 caracteres.",
	}),
	destination: z.string().min(3, {
		message: "El destino debe tener al menos 3 caracteres.",
	}),
});

type FormData = z.infer<typeof formSchema>;

const PortSearchForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			origin: "",
			destination: "",
		},
	});
	const [isHovered, setIsHovered] = useState(false);
	const [originQuery, setOriginQuery] = useState("");
	const [destinationQuery, setDestinationQuery] = useState("");
	const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
	const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
	const [loadingOrigin, setLoadingOrigin] = useState(false);
	const [loadingDestination, setLoadingDestination] = useState(false);

	const debouncedOrigin = useDebounce(originQuery, 400);
	const debouncedDestination = useDebounce(destinationQuery, 400);

	// Buscar sugerencias para origen
	type Port = { name: string };

	const fetchPorts = async (query: string): Promise<string[]> => {
		if (query.length < 3) return [];
		try {
			const res = await fetch(`https://marines-services.vercel.app/portSearch?name=${encodeURIComponent(query)}`);
			if (!res.ok) return [];
			const data: Port[] = await res.json();
			return data.map((port) => port.name);
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
	}, [ debouncedOrigin ]);

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
	}, [ debouncedDestination ]);

	const onSubmit = (data: FormData) => {
		console.log(data);
		// consulta a la api y obtención de datos
	};

	return (
		<View className="w-full max-w-2xl shadow-xl p-2 space-y-4 rounded-lg">
			<View className='text-center py-4 px-2 gap-3'>
				<Text className='text-primary font-bold text-3xl self-center'>
					Buscar Itinerario
				</Text>
				<Text className='text-primary text-base'>
					Encuentre rutas entre puertos marítimos de todo el mundo
				</Text>
			</View>

			<View id='inputsWrapper' className="grid gap-6 md:grid-cols-2">
				{/* Origen */}
				<View className='space-y-2'>
					<Text className={"text-primary text-sm font-medium"}>Origen</Text>
					<Controller
						control={control}
						name='origin'
						render={({ field: { onChange, value } }) => (
							<View className='relative'>
								<MapPin className='text-foreground absolute left-3 h-4.5 w-4.5 top-3 z-50' />
								<TextInput
									className='border border-foreground outline-foreground rounded-md text-base placeholder:text-foreground text-primary pl-10 h-12'
									onChangeText={(text) => {
										onChange(text);
										setOriginQuery(text);
									}}
									value={value}
									placeholder='San Antonio, Chile'
									autoCorrect={false}
									autoCapitalize='none'
								/>
								{loadingOrigin && (
									<ActivityIndicator
										size='small'
										color='#5a8ce8'
									/>
								)}
								{originSuggestions.length > 0 && (
									<FlatList
										data={originSuggestions}
										keyExtractor={(item) => item}
										renderItem={({ item }) => (
											<TouchableOpacity
												onPress={() => {
													onChange(item);
													setOriginQuery(item);
													setOriginSuggestions([]);
												}}
												style={{ padding: 8, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#eee" }}>
												<Text>{item}</Text>
											</TouchableOpacity>
										)}
										style={{ maxHeight: 120, borderWidth: 1, borderColor: "#eee", borderRadius: 4, marginTop: 2 }}
									/>
								)}
								{errors.origin && <Text className='text-error font-semibold'>{errors.origin.message}</Text>}
							</View>
						)}
					/>
				</View>

				{/* Destino */}
				<View className='space-y-2'>
					<Text className={"text-primary text-sm font-medium"}>Destino</Text>
					<Controller
						control={control}
						name='destination'
						render={({ field: { onChange, value } }) => (
							<View className='relative'>
								<MapPin className='text-foreground absolute left-3 h-4.5 w-4.5 top-3 z-50' />
								<TextInput
									className='border border-foreground outline-foreground rounded-md text-base placeholder:text-foreground text-primary pl-10 h-12'
									onChangeText={(text) => {
										onChange(text);
										setDestinationQuery(text);
									}}
									value={value}
									placeholder='Shanghai, China'
									autoCorrect={false}
									autoCapitalize='none'
								/>
								{loadingDestination && (
									<ActivityIndicator
										size='small'
										color='#5a8ce8'
									/>
								)}
								{destinationSuggestions.length > 0 && (
									<FlatList
										data={destinationSuggestions}
										keyExtractor={(item) => item}
										renderItem={({ item }) => (
											<TouchableOpacity
												onPress={() => {
													onChange(item);
													setDestinationQuery(item);
													setDestinationSuggestions([]);
												}}
												style={{ padding: 8, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#eee" }}>
												<Text>{item}</Text>
											</TouchableOpacity>
										)}
										style={{ maxHeight: 120, borderWidth: 1, borderColor: "#eee", borderRadius: 4, marginTop: 2 }}
									/>
								)}
								{errors.destination && <Text className='text-error font-semibold'>{errors.destination.message}</Text>}
							</View>
						)}
					/>
				</View>
			</View>



			<Pressable
				style={isHovered ? styles.buttonHover : styles.button}
				className='w-full p-2 rounded-md text-white items-center hover:!bg-[#091836]'
				onPress={handleSubmit(onSubmit)}
				onPressIn={() => setIsHovered(true)}
				onPressOut={() => setIsHovered(false)}>
				<Text
					style={styles.buttonText}
					className={"text-base font-semibold"}>
					Buscar
				</Text>
			</Pressable>
		</View>
	);
};
export default PortSearchForm;

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#5a8ce8",
		borderColor: "#5a8ce8",
	},
	buttonHover: {
		backgroundColor: "#091836",
		borderColor: "#091836",
	},
	buttonText: {
		color: "white",
	},
});
