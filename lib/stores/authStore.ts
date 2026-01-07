import { create } from 'zustand';
import { storageService } from '@/lib/services/storageService';
import { ROUTES } from '@/lib/Routes';
import type {
	AuthState,
	AuthActions,
	LoginResponse,
	VerifyResponse,
} from '@/lib/types/authTypes';

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	login: async (email: string, password: string) => {
		set({ isLoading: true, error: null });

		try {
			const response = await fetch(ROUTES.API_LOGIN, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data: LoginResponse = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(data.message || 'Error al iniciar sesión');
			}

			if (!data.token || !data.user) {
				throw new Error('Respuesta inválida del servidor');
			}

			await storageService.setToken(data.token);
			await storageService.setUser(data.user);

			set({
				user: data.user,
				token: data.token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (error: any) {
			const errorMessage =
				error.message || 'Error al iniciar sesión. Intenta nuevamente.';

			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: errorMessage,
			});

			throw new Error(errorMessage);
		}
	},

	logout: async () => {
		set({ isLoading: true });

		try {
			const token = get().token;

			if (token) {
				await fetch(ROUTES.API_LOGOUT, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			}
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		} finally {
			await storageService.clearAll();

			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			});
		}
	},

	verifyToken: async () => {
		set({ isLoading: true });

		try {
			const token = await storageService.getToken();

			if (!token) {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					isLoading: false,
				});
				return;
			}

			const response = await fetch(ROUTES.API_USER_VERIFY, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data: VerifyResponse = await response.json();

			if (!response.ok || !data.success || !data.user) {
				await storageService.clearAll();
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					isLoading: false,
				});
				return;
			}

			set({
				user: data.user,
				token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			console.error('Error al verificar token:', error);
			await storageService.clearAll();

			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},

	initializeAuth: async () => {
		set({ isLoading: true });

		try {
			const token = await storageService.getToken();
			const user = await storageService.getUser();

			if (token && user) {
				set({
					user,
					token,
					isAuthenticated: true,
					isLoading: false,
				});

				get().verifyToken();
			} else {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					isLoading: false,
				});
			}
		} catch (error) {
			console.error('Error al inicializar autenticación:', error);
			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},

	clearError: () => {
		set({ error: null });
	},
}));
