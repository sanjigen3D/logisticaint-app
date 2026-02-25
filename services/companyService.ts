import { ROUTES } from '@/lib/Routes';
import { Company } from '@/lib/types/types';

const API_URL = ROUTES.API_ROUTE;

export const companyService = {
    getCompanies: async (token: string): Promise<Company[]> => {
        const response = await fetch(`${API_URL}/companies`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al obtener las empresas');
        }

        const data = await response.json();
        // Assuming the API returns { success: true, data: Company[] } based on typical structures
        return data.data || [];
    },
};
