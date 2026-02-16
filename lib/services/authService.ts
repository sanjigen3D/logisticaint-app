import { ROUTES } from '@/lib/Routes';
import { AuthResponse, User } from '@/lib/types/auth';

const API_URL = ROUTES.API_ROUTE;

export const authService = {
	async login(email: string, password: string): Promise<AuthResponse> {
		const response = await fetch(`${API_URL}${ROUTES.API_LOGIN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data: AuthResponse = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Error during login');
		}

		return data;
	},

	async verifyToken(token: string): Promise<User | null> {
		try {
			const response = await fetch(`${API_URL}${ROUTES.API_USER_VERIFY}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				return null;
			}

			return data.user || null;
		} catch {
			return null;
		}
	},

	async getProfile(token: string): Promise<User | null> {
		try {
			const response = await fetch(`${API_URL}${ROUTES.API_GET_PROFILE}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				return null;
			}

			return data.user || null;
		} catch {
			return null;
		}
	},

	async logout(token: string): Promise<void> {
		try {
			await fetch(`${API_URL}${ROUTES.API_LOGOUT}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});
		} catch {
			// Logout error - token is cleared on client anyway
		}
	},
};
