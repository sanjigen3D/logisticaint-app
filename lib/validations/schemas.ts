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
