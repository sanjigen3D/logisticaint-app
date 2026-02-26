import { ROUTES } from '@/lib/Routes';
import { Company, CreateCompanyFormData } from '@/lib/types/types';

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
        return data.data || [];
    },

    createCompany: async (companyData: CreateCompanyFormData, token: string): Promise<{ company?: Company }> => {
        const response = await fetch(`${API_URL}/companies`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear la empresa');
        }

        return data;
    },

    updateCompany: async (id: number, companyData: Partial<CreateCompanyFormData>, token: string): Promise<{ company?: Company }> => {
        const response = await fetch(`${API_URL}/companies/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar la empresa');
        }

        return data;
    },
};
