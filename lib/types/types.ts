import {
	createCompanySchema,
	createContactSchema,
	createUserSchema,
	formSchema,
	loginSchema,
	RequestNewUserSchema,
	trackingSchema,
} from '@/lib/validations/schemas';
import { z } from 'zod';

import { ExternalPathString, RelativePathString } from 'expo-router';

export type MyRoute = RelativePathString | ExternalPathString;


// formData de itinerarios
export type FormData = z.infer<typeof formSchema>;
export type Port = { name: string; country: string; location?: string };
export type TrackingFormData = z.infer<typeof trackingSchema>;
export type RegisterFormData = z.infer<typeof RequestNewUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;


export type Naviera = 'Zim' | 'Hapag' | 'Maersk';
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;
export type CreateContactFormData = z.infer<typeof createContactSchema>;

export interface Company {
	id: number;
	name: string;
	razon_social: string;
	rut: string;
	direccion: string;
	alias: string;
	contacts?: Contact[];
}

export interface Contact {
	id: number;
	name: string;
	phone: string;
	email: string;
	company_id: number;
}
