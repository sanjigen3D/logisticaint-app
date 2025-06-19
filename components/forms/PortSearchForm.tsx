import { TextInput, Text, Pressable, StyleSheet, View } from "react-native"
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const formSchema = z.object({
	origin: z.string().min(3, {
		message: 'El origen debe tener al menos 3 caracteres.',
	} ),
	destination: z.string().min(3, {
		message: 'El destino debe tener al menos 3 caracteres.',
	} ),
})

type FormData = z.infer<typeof formSchema>;


const PortSearchForm = () => {
	const { control, handleSubmit, formState: {errors} } = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			origin: '',
			destination: '',
		},
	});
	const [isHovered, setIsHovered] = useState(false);

	const onSubmit = (data: FormData) => {
		console.log(data);
		// consulta a la api y obtención de datos
	}

	return (
		<View className="mt-10 w-[95%] md:max-w-3xl md:w-1/2 gap-6 border p-4 rounded-xl border-[#596d91] bg-[#ebf1f8]" >
			<View className="items-center">
				<Text className="text-primary font-bold text-2xl">
					Buscar Itinerario
				</Text>
			</View>
			<View className="gap-1.5">
				<Text className={"text-primary font-bold text-xl"}>
					Origen
				</Text>
				<Controller
					control={control}
					name="origin"
					render={({field: {onChange, value, disabled, onBlur}}) => (
						<View className="gap-1.5">
							<TextInput
								className="border border-foreground outline-foreground p-2 rounded-md text-base placeholder:text-foreground text-primary"
								onChangeText={onChange}
								value={value}
								placeholder="San Antonio, Chile"
								/>
							{errors.origin && (
								<Text className="text-error font-semibold">
									{errors.origin.message}
								</Text>
							)}
						</View>
					)}
					/>
			</View>

			<View className="gap-1.5">
				<Text className={"text-primary font-bold text-xl"}>
					Destino
				</Text>
				<Controller
					control={control}
					name="destination"
					render={({field: {onChange, value, disabled, onBlur}}) => (
						<View className="gap-1.5">
							<TextInput
								className="border border-foreground outline-foreground p-2 rounded-md text-base placeholder:text-foreground text-primary"
								onChangeText={onChange}
								value={value}
								placeholder="Shanghai, China"
							/>
							{errors.destination && (
								<Text className="text-error font-semibold">
									{errors.destination.message}
								</Text>
							)}
						</View>
					)}
				/>
			</View>

			<Pressable style={isHovered ? styles.buttonHover : styles.button}
			           className="w-full p-2 rounded-md text-white items-center hover:!bg-[#091836]"
			           onPress={handleSubmit(onSubmit)}
			           onPressIn={() => setIsHovered(true)}
			           onPressOut={() => setIsHovered(false)}>
				<Text style={styles.buttonText} className={"text-base font-semibold"}>
					Buscar
				</Text>
			</Pressable>
		</View>
	)
}
export default PortSearchForm

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#5a8ce8',
		borderColor: '#5a8ce8',
	},
	buttonHover: {
		backgroundColor: '#091836',
		borderColor: '#091836',
	},
	buttonText: {
		color: 'white',
	},
})
