import { ROUTES } from '@/lib/Routes';

const API_URL = ROUTES.API_ROUTE;
const CREATE_USER_URL = `${API_URL}${ROUTES.API_CREATE_USER}`;

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    type_id: number;
    active: boolean;
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        name: string;
        email: string;
        active: boolean;
        type_id: number;
    };
}

export const userService = {
    async createUser(
        data: CreateUserPayload,
        token: string
    ): Promise<CreateUserResponse> {
        const response = await fetch(CREATE_USER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const json: CreateUserResponse = await response.json();

        if (!response.ok) {
            throw new Error(json.message || 'Error al crear el usuario');
        }

        return json;
    },
};
