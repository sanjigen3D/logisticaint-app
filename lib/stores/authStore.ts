import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore, User } from '@/lib/types/auth';
import { authService } from '@/lib/services/authService';

const STORAGE_KEYS = {
	TOKEN: 'auth_token',
	USER: 'auth_user',
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
				throw new Error(response.message || 'Login failed');
			}

			await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
			await AsyncStorage.setItem(
				STORAGE_KEYS.USER,
				JSON.stringify(response.user)
			);

			set({
				user: response.user,
				token: response.token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Login failed';
			set({
				isLoading: false,
				error: errorMessage,
				isAuthenticated: false,
				token: null,
				user: null,
			});
			throw error;
		}
	},

	logout: async () => {
		const { token } = get();

		try {
			if (token) {
				await authService.logout(token);
			}

			await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
			await AsyncStorage.removeItem(STORAGE_KEYS.USER);

			set({
				user: null,
				token: null,
				isAuthenticated: false,
				error: null,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Logout failed';
			set({ error: errorMessage });
			throw error;
		}
	},

	verifyToken: async () => {
		set({ isLoading: true });

		try {
			const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

			if (!token) {
				set({
					isLoading: false,
					isAuthenticated: false,
					user: null,
					token: null,
				});
				return;
			}

			const user = await authService.verifyToken(token);

			if (!user) {
				await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
				await AsyncStorage.removeItem(STORAGE_KEYS.USER);
				set({
					isLoading: false,
					isAuthenticated: false,
					user: null,
					token: null,
					error: 'Token expired or invalid',
				});
				return;
			}

			set({
				user,
				token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Token verification failed';
			set({
				isLoading: false,
				error: errorMessage,
				isAuthenticated: false,
				user: null,
				token: null,
			});
		}
	},

	clearError: () => {
		set({ error: null });
	},

	setLoading: (loading: boolean) => {
		set({ isLoading: loading });
	},
}));
