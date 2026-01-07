export interface User {
	id: number;
	email: string;
	name: string;
	type: 'Admin' | 'Manager' | 'User';
	active: boolean;
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
	initializeAuth: () => Promise<void>;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	token?: string;
	user?: User;
}

export interface VerifyResponse {
	success: boolean;
	message: string;
	user?: User;
}
