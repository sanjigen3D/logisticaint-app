import { storage } from '@/lib/storage';
import { AuthStore } from '@/lib/types/auth.types';
import { authService } from '@/services/authService';
import { create } from 'zustand';

const STORAGE_KEYS = {
	TOKEN: "auth_token",
	USER: "auth_user"
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	login: async (email: string, password: string) => {
		set({ isLoading: true, error: null });

		try {
			const response = await authService.login(email, password);

			if (!response.success || !response.token || !response.user) {
				throw new Error(response.message || "Intento de Login fallido")
			}

			await storage.setItem(STORAGE_KEYS.TOKEN, response.token);
			await storage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

			set({
				user: response.user,
				token: response.token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : "Intento de Login fallido";

			set({
				isLoading: false,
				error: errorMessage,
				isAuthenticated: false,
				token: null,
				user: null,
			});

			throw e;
		}
	},

	logout: async () => {
		try {
			await storage.removeItem(STORAGE_KEYS.TOKEN);
			await storage.removeItem(STORAGE_KEYS.USER);

			set({
				user: null,
				token: null,
				isAuthenticated: false,
				error: null,
			});
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : "Intento de Logout fallido";
			set({ error: errorMessage });
			throw e;
		}
	},
	verifyToken: async () => {
		set({ isLoading: true });

		try {
			const token = await storage.getItem(STORAGE_KEYS.TOKEN);
			const storedUser = await storage.getItem(STORAGE_KEYS.USER);

			if (!token) {
				set({
					isLoading: false,
					isAuthenticated: false,
					user: null,
					token: null,
				});
				return;
			}

			// hidrato el User con lo guardado para mejora en UX
			if (storedUser) {
				set({
					user: JSON.parse(storedUser),
					token,
					isAuthenticated: true,
					isLoading: false,
					error: null
				})
			}

			const user = await authService.verifyToken(token);
			if (!user) {

				await storage.removeItem(STORAGE_KEYS.TOKEN);
				await storage.removeItem(STORAGE_KEYS.USER);

				set({
					isLoading: false,
					isAuthenticated: false,
					user: null,
					token: null,
					error: "Token expirado, vuelva a iniciar sesión"
				});
				return;
			}

			set({
				user,
				token,
				isAuthenticated: true,
				isLoading: false,
				error: null
			});
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : "Verificación de Token fallida";
			set({
				isLoading: false,
				error: errorMessage,
				isAuthenticated: false,
				token: null,
				user: null,
			});
		}
	},

	clearError: () => {
		set({ error: null });
	},

	setLoading: (loading: boolean) => set({ isLoading: loading }),

}))