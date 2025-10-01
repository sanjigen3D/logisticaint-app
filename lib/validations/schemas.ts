import { z } from 'zod';

// Formulario para Itinerario
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
	carrier: z.enum(['Hapag', 'Zim', 'Maersk'], {
		required_error: 'Debe seleccionar una naviera',
		invalid_type_error: 'Naviera no válida',
	}),
});

// formulario de registro
export const registerSchema = z.object({
	firstName: z
		.string()
		.min(1, 'El nombre es requerido')
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(50, 'El nombre no puede exceder 50 caracteres')
		.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
	lastName: z
		.string()
		.min(1, 'El apellido es requerido')
		.min(2, 'El apellido debe tener al menos 2 caracteres')
		.max(50, 'El apellido no puede exceder 50 caracteres')
		.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
	company: z
		.string()
		.min(1, 'La empresa es requerida')
		.min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
		.max(100, 'El nombre de la empresa no puede exceder 100 caracteres'),
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Ingresa un email válido')
		.toLowerCase(),
});
