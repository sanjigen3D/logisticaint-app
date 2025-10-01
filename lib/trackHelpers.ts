import { ROUTES } from '@/lib/Routes';
import { Naviera } from '@/lib/types/types';
import { convertZimToUnified } from '@/lib/mappers/ZimMapper';
import { convertHapagToUnified } from '@/lib/mappers/HapagMapper';

export const getTrackingUrl = (carrier: Naviera, trackingNumber: string) => {
	switch (carrier) {
		case 'Zim':
			return `${ROUTES.API_ROUTE}/tracking/Zim?trackingNumber=${trackingNumber}`;
		case 'Hapag':
			return `${ROUTES.API_ROUTE}/tracking/Hapag?trackingNumber=${trackingNumber}`;
		case 'Maersk':
			return `${ROUTES.API_ROUTE}/tracking/Maersk?trackingNumber=${trackingNumber}`;
	}
};

export const fetchTrackingData = async (
	carrier: Naviera,
	trackingNumber: string,
) => {
	const response = await fetch(getTrackingUrl(carrier, trackingNumber), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status !== 200) throw new Error('Error al obtener datos');

	const data = await response.json();

	// normalización de datos
	switch (carrier) {
		case 'Zim':
			return convertZimToUnified(data, trackingNumber);
		case 'Hapag':
			return convertHapagToUnified(data, trackingNumber);
		case 'Maersk':
			// Mapeo de Maersk aun no incorporado
			return data;
		default:
			throw new Error('Carrier no soportado');
	}
};
