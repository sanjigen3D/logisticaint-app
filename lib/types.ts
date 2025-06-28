import { z } from 'zod';
import { formSchema } from '@/lib/validations/schemas';

export type FormData = z.infer<typeof formSchema>;
export type Port = { name: string; country: string };
