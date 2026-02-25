import {
	UnifiedRoute,
	UnifiedTrackingData,
	UnifiedTrackingEvent,
} from '@/lib/types/unifiedInterfaces';
import { ZimResponse, ZimTrackingResult } from '@/lib/types/zim/zimTypes';
import { formatDate } from '@/lib/utils';

// Mapper para el apartado de itinerarios
export function mapZimResponseToUnifiedRoutes(
	data: ZimResponse,
): UnifiedRoute[] {
	if (!data.response.routes) return [];
	return data.response.routes.map((route) => ({
		id: `ZIM-${route.routeSequence}`,
		carrier: 'ZIM',
		company: 'ZIM',
		transitTime: route.transitTime,
		legs: route.routeLegs.map((leg) => {
			return {
				vesselName: leg.vesselName,
				vesselCode: leg.vesselCode?.trim() ?? undefined,
				imoNumber: leg.lloydsCode ?? undefined,
				callSign: leg.callSign ?? undefined,
				voyage: leg.voyage,
				departure: {
					portName: leg.departurePortName,
					portCode: leg.departurePort,
					dateTime: leg.departureDate,
				},
				arrival: {
					portName: leg.arrivalPortName,
					portCode: leg.arrivalPort,
					dateTime: leg.arrivalDate,
				},
			};
		}),
	}));
}

// Mapper para el apartado de tracking
export const convertZimToUnified = (
	zimData: ZimTrackingResult,
	trackingNum: string,
): UnifiedTrackingData => {
	// Crear eventos principales de la ruta
	const routeEvents: UnifiedTrackingEvent[] = zimData.routeDetails
		.filter((route) => route.sailingDateTz && route.arrivalDateTz)
		.flatMap((route, index) => [
			{
				id: `zim-departure-${index}`,
				date: route.sailingDateTz!,
				status: `Salida de ${route.portNameFrom}`,
				location: `${route.portNameFrom}, ${route.countryNameFrom}`,
				vessel: route.vesselName || undefined,
				voyage: route.voyage || undefined,
				eventType: 'transport' as const,
				completed: new Date(route.sailingDateTz!) <= new Date(),
			},
			{
				id: `zim-arrival-${index}`,
				date: route.arrivalDateTz!,
				status: `Llegada a ${route.portNameTo}`,
				location: `${route.portNameTo}, ${route.countryNameTo}`,
				vessel: route.vesselName || undefined,
				voyage: route.voyage || undefined,
				eventType: 'transport' as const,
				completed: new Date(route.arrivalDateTz!) <= new Date(),
			},
		]);

	// Crear detalles de ruta para mostrar
	const routeDetails = zimData.routeDetails
		.filter((route) => route.sailingDateTz && route.arrivalDateTz)
		.map((route) => ({
			from: `${route.portNameFrom}, ${route.countryNameFrom}`,
			to: `${route.portNameTo}, ${route.countryNameTo}`,
			vessel: route.vesselName || 'No disponible',
			departure: route.sailingDateTz!,
			arrival: route.arrivalDateTz!,
			voyage: route.voyage || 'N/A',
		}));

	// Crear información de contenedores
	const containers = zimData.bkBlDetails.consContainerList.map((container) => ({
		number: container.containerNumber.trim(),
		type: container.containerTypeSize,
		events: container.containerEventsList.map((event, index) => ({
			id: `container-${container.containerNumber}-${index}`,
			date: event.activityDateTz,
			status: event.eventName,
			location: `${event.port}, ${event.countryPort}`,
			vessel: event.vesselName,
			voyage: event.voyage,
			eventType: 'container' as const,
			completed: new Date(event.activityDateTz) <= new Date(),
		})),
	}));

	return {
		trackingNumber: trackingNum,
		status:
			new Date(zimData.finalETA.etaValue) > new Date()
				? 'En tránsito'
				: 'Entregado',
		origin: `${zimData.bkBlDetails.portOfLoading}, ${zimData.bkBlDetails.countryNamePortOfLoading}`,
		destination: `${zimData.bkBlDetails.portOfDischarge}, ${zimData.bkBlDetails.countryNamePortOfDischarge}`,
		estimatedArrival: formatDate(zimData.finalETA.etaValue),
		carrier: 'ZIM Integrated Shipping Services',
		events: routeEvents.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		),
		containers,
		routeDetails,
	};
};
