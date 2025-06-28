import { z } from 'zod';

export const formSchema = z.object({
	origin: z.object({
		name: z.string().min(3, {
			message: 'El origen debe tener al menos 3 caracteres.',
		}),
		country: z
			.string()
			.min(2, { message: 'El pais debe tener al menos 2 caracteres.' }),
	}),
	destination: z.object({
		name: z.string().min(3, {
			message: 'El destino debe tener al menos 3 caracteres.',
		}),
		country: z
			.string()
			.min(2, { message: 'El pais debe tener al menos 2 caracteres.' }),
	}),
});
