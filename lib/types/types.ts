import { z } from 'zod';
import {
	formSchema,
	loginSchema,
	RequestNewUserSchema,
	trackingSchema,
} from '@/lib/validations/schemas';

import { ExternalPathString, RelativePathString } from 'expo-router';

export type MyRoute = RelativePathString | ExternalPathString;


// formData de itinerarios
export type FormData = z.infer<typeof formSchema>;
export type Port = { name: string; country: string; location?: string };
export type TrackingFormData = z.infer<typeof trackingSchema>;
export type RegisterFormData = z.infer<typeof RequestNewUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;


export type Naviera = 'Zim' | 'Hapag' | 'Maersk';
