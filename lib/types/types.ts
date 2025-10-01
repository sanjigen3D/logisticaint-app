import { z } from 'zod';
import {
	formSchema,
	registerSchema,
	trackingSchema,
} from '@/lib/validations/schemas';

// formData de itinerarios
export type FormData = z.infer<typeof formSchema>;
export type Port = { name: string; country: string; location?: string };

export type TrackingFormData = z.infer<typeof trackingSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type Naviera = 'Zim' | 'Hapag' | 'Maersk';
