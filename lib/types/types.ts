import { z } from 'zod';
import {
	formSchema,
	loginSchema,
	RequestNewUserSchema,
	trackingSchema,
} from '@/lib/validations/schemas';
import { LoginFormData } from '@/lib/types/auth';

// formData de itinerarios
export type FormData = z.infer<typeof formSchema>;
export type Port = { name: string; country: string; location?: string };

export type TrackingFormData = z.infer<typeof trackingSchema>;
export type RegisterFormData = z.infer<typeof RequestNewUserSchema>;
export type { LoginFormData };

export type Naviera = 'Zim' | 'Hapag' | 'Maersk';
