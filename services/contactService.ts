import { ROUTES } from '@/lib/Routes';
import { Contact, CreateContactFormData } from '@/lib/types/types';

const API_URL = ROUTES.API_ROUTE;

export const contactService = {
    getContacts: async (token: string): Promise<Contact[]> => {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al obtener los contactos');
        }

        const data = await response.json();
        return data.data || [];
    },

    createContact: async (contactData: CreateContactFormData, token: string): Promise<{ contact?: Contact }> => {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear el contacto');
        }

        return data;
    },

    updateContact: async (id: number, contactData: Partial<CreateContactFormData>, token: string): Promise<{ contact?: Contact }> => {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar el contacto');
        }

        return data;
    },
};
