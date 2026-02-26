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
export const RequestNewUserSchema = z.object({
	firstName: z
		.string()
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

// formulario de login
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Ingresa un email válido')
		.toLowerCase(),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// formulario de creación de usuario (admin)
export const createUserSchema = z.object({
	name: z
		.string()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(100, 'El nombre no puede exceder 100 caracteres'),
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Ingresa un email válido')
		.toLowerCase(),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	type_id: z.number({ required_error: 'Debe seleccionar un tipo de usuario' }).int().min(1).max(3),
	company_id: z.number({ required_error: 'Debe seleccionar una empresa' }).int().positive('Empresa inválida'),
	active: z.boolean(),
});

// formulario de creación de empresa (solo Admin)
export const createCompanySchema = z.object({
	name: z
		.string()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(150, 'El nombre no puede exceder 150 caracteres'),
	razon_social: z
		.string()
		.min(2, 'La razón social debe tener al menos 2 caracteres')
		.max(200, 'La razón social no puede exceder 200 caracteres'),
	rut: z
		.string()
		.min(3, 'El RUT es requerido')
		.max(20, 'El RUT no puede exceder 20 caracteres'),
	direccion: z
		.string()
		.min(5, 'La dirección debe tener al menos 5 caracteres')
		.max(250, 'La dirección no puede exceder 250 caracteres'),
	alias: z
		.string()
		.min(2, 'El alias debe tener al menos 2 caracteres')
		.max(50, 'El alias no puede exceder 50 caracteres'),
});

// formulario de creación de contacto (Manager o superior)
export const createContactSchema = z.object({
	name: z
		.string()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(150, 'El nombre no puede exceder 150 caracteres'),
	phone: z
		.string()
		.min(6, 'El teléfono debe tener al menos 6 caracteres')
		.max(30, 'El teléfono no puede exceder 30 caracteres'),
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Ingresa un email válido')
		.toLowerCase(),
	company_id: z.number({ required_error: 'Debe seleccionar una empresa' }).int().positive('Empresa inválida'),
});

// formularios de edición
export const editUserSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).optional(),
	email: z.string().email('Ingresa un email válido').toLowerCase().optional(),
	type_id: z.number().int().min(1).max(3).optional(),
	company_id: z.number().int().positive().optional(),
	active: z.boolean().optional(),
});

export const editCompanySchema = z.object({
	name: z.string().min(2).max(150).optional(),
	razon_social: z.string().min(2).max(200).optional(),
	rut: z.string().min(3).max(20).optional(),
	direccion: z.string().min(5).max(250).optional(),
	alias: z.string().min(2).max(50).optional(),
});

export const editContactSchema = z.object({
	name: z.string().min(2).max(150).optional(),
	phone: z.string().min(6).max(30).optional(),
	email: z.string().email().toLowerCase().optional(),
	company_id: z.number().int().positive().optional(),
});
