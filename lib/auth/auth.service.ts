interface LoginCredentials {
	email: string;
	password: string;
}

interface LoginResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name?: string;
	};
}

/**
 * Servicio para autenticar usuarios
 * @returns {Promise<LoginResponse>} Resuelve con el token y el usuario autenticado
 * */
export const authService = {
	login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
		const response = await fetch(
			'https://marines-services.vercel.app/auth/login',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			},
		);

		if (!response.ok) {
			const error = await response.json().catch(() => ({
				message: 'Error al iniciar sesión',
			}));
			throw new Error(error.message || 'Error al iniciar sesión');
		}

		return response.json();
	},
};
