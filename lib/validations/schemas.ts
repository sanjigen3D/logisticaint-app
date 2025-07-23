import { z } from 'zod';

export const formSchema = z.object({
	origin: z.object({
		name: z.string().min(3, {
			message: 'El origen debe tener al menos 3 caracteres.',
		}),
		country: z
			.string()
			.min(2, { message: 'El pais debe tener al menos 2 caracteres.' }),
		location: z.string().optional(),
	}),
	destination: z.object({
		name: z.string().min(3, {
			message: 'El destino debe tener al menos 3 caracteres.',
		}),
		country: z
			.string()
			.min(2, { message: 'El pais debe tener al menos 2 caracteres.' }),
		location: z.string().optional(),
	}),
});

export const trackingSchema = z.object({
	trackingNumber: z
		.string()
		.min(3, 'El número debe tener al menos 3 caracteres')
		.max(50, 'El número no puede exceder 50 caracteres')
		.regex(/^[A-Z0-9]+$/i, 'Solo se permiten letras y números')
		.transform((val) => val.toUpperCase()),
	carrier: z.enum(['hapag', 'zim'], {
		required_error: 'Debe seleccionar una naviera',
		invalid_type_error: 'Naviera no válida',
	}),
});
