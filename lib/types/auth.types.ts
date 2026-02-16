import {z} from "zod";
import {loginSchema} from '@/lib/validations/schemas';

export type LoginFormData = z.infer<typeof loginSchema>;

export interface User {
	id: number;
	email: string;
	name: string;
	type: "Admin" | "Manager" | "User";
	active: boolean;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	token?: string;
	user?: User;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface AuthActions {
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	verifyToken: () => Promise<void>;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;