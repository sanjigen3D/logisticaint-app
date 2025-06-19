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
		<View style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={styles.title} >Buscar Puertos</Text>
			</View>
			<View>
				<Text style={styles.text}>Origen</Text>
				<Controller
					control={control}
					name="origin"
					render={({field: {onChange, value, disabled, onBlur}}) => (
						<View>
							<TextInput
								style={styles.input}
								onChangeText={onChange}
								value={value}
								placeholder="San Antonio, Chile"
								/>
							{errors.origin && (
								<Text style={styles.errorMessage}>{errors.origin.message}</Text>
							)}
						</View>
					)}
					/>
			</View>

			<View>
				<Text style={styles.text}>Destino</Text>
				<Controller
					control={control}
					name="destination"
					render={({field: {onChange, value, disabled, onBlur}}) => (
						<View>
							<TextInput
								style={styles.input}
								onChangeText={onChange}
								value={value}
								placeholder="Shanghai, China"
							/>
							{errors.destination && (
								<Text style={styles.errorMessage}>{errors.destination.message}</Text>
							)}
						</View>
					)}
				/>
			</View>

			<Pressable style={isHovered ? styles.buttonHover: styles.button}
			           onPress={handleSubmit(onSubmit)}
			           onPressIn={() => setIsHovered(true)}
			           onPressOut={() => setIsHovered(false)}>
				<Text style={styles.buttonText}>Search</Text>
			</Pressable>
		</View>
	)
}
export default PortSearchForm

const styles = StyleSheet.create({
	container:{
		marginTop: 20,
		marginEnd: 'auto',
		marginStart: 'auto',
		width: "50%",
		gap: 20,
		borderWidth: 1,
		padding: 5,
		borderRadius: 10,
		backgroundColor: '#ebf1f8',
		borderColor: '#596d91'
	},
	input: {
		borderWidth: 1,
		borderColor: '#b2c1e1',
		padding: 10,
		borderRadius: 5,
		fontSize: 14,
		margin: 2,
		color: '#33548e',
		outlineColor: '#596d91',
	},
	button: {
		backgroundColor: '#5a8ce8',
		padding: 10,
		borderRadius: 5,
		borderColor: '#5a8ce8',
		alignItems: 'center',
	},
	buttonHover: {
		backgroundColor: '#091836',
		padding: 10,
		borderRadius: 5,
		borderColor: '#091836',
		alignItems: 'center'
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
	},
	errorMessage: {
		color: '#c33f3f',
		fontSize: 16,
	},
	text: {
		color: '#33548e',
		fontSize: 20,
		fontWeight: 'bold'
	},
	title: {
		color: '#33548e',
		fontSize: 24,
		fontWeight: 'bold',
	},
	titleContainer: {
		alignItems: 'center',
		paddingTop: 10
	}
})
