import { z } from 'zod';
import { formSchema, trackingSchema } from '@/lib/validations/schemas';

export type FormData = z.infer<typeof formSchema>;
export type Port = { name: string; country: string; location?: string };

export type TrackingFormData = z.infer<typeof trackingSchema>;
