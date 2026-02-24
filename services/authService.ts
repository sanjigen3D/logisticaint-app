import { ROUTES } from '@/lib/Routes';
import { AuthResponse, User } from '@/lib/types/auth.types';

const API_URL = ROUTES.API_ROUTE;
const LOGIN_URL = `${API_URL}${ROUTES.API_LOGIN}`;
const USER_VERIFY = `${API_URL}${ROUTES.API_USER_VERIFY}`
const GET_PROFILE = `${API_URL}${ROUTES.API_GET_PROFILE}`

export const authService = {
	async login(email: string, password: string): Promise<AuthResponse> {
		const response = await fetch(LOGIN_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data: AuthResponse = await response.json();

		if (!response.ok) throw new Error(data.message || "Error durante el login");

		return data;
	},

	async verifyToken(token: string): Promise<User | null> {
		try {
			const response = await fetch(USER_VERIFY, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			const data = await response.json();

			if (!response.ok) return null;

			return data.user || null;
		} catch {
			return null;
		}
	},

	async getProfile(token: string): Promise<User | null> {
		try {
			const response = await fetch(GET_PROFILE, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
			});

			const data = await response.json();

			if (!response.ok) return null;

			return data.user || null;
		} catch {
			return null;
		}
	},
};

