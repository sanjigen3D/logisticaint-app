import {
	UnifiedRoute,
	UnifiedTrackingData,
	UnifiedTrackingEvent,
} from '@/lib/types/unifiedInterfaces';
import { formatDate, getEventTypeDescription } from '@/lib/utils';
import { HapagEvent } from '../types/hapag/hapagTypes';

export function mapHapagToUnified(hapagData: any[]): UnifiedRoute[] {
	return hapagData.map((route, index) => {
		const firstLeg = route.legs[0];
		const servicePartner = firstLeg.transport.servicePartners[0];

		const carrier = servicePartner?.carrierCode || 'Hapag-Lloyd';
		const serviceName = servicePartner?.carrierServiceName;
		const serviceCode = servicePartner?.carrierServiceCode;

		const legs = route.legs.map((leg: any) => ({
			vesselName: leg.transport.vessel.name,
			vesselCode: undefined, // Hapag no trae un vesselCode separado
			imoNumber: leg.transport.vessel.vesselIMONumber,
			callSign: leg.transport.vessel.callSign,
			voyage:
				leg.transport.universalImportVoyageReference ||
				leg.transport.universalExportVoyageReference,

			departure: {
				portName: leg.departure.location.locationName,
				portCode: leg.departure.location.UNLocationCode,
				city: leg.departure.location.address.city,
				countryCode: leg.departure.location.address.countryCode,
				dateTime: leg.departure.dateTime,
			},

			arrival: {
				portName: leg.arrival.location.locationName,
				portCode: leg.arrival.location.UNLocationCode,
				city: leg.arrival.location.address.city,
				countryCode: leg.arrival.location.address.countryCode,
				dateTime: leg.arrival.dateTime,
			},
		}));

		return {
			id: `hapag-${route.solutionNumber ?? index}`,
			carrier,
			serviceName,
			serviceCode,
			transitTime: route.transitTime,
			legs,
		};
	});
}

// Mapper de Hapag para el tracking
export const convertHapagToUnified = (
	hapagData: HapagEvent[],
	trackingNum: string,
): UnifiedTrackingData => {
	const events: UnifiedTrackingEvent[] = hapagData.map((event, index) => ({
		id: `hapag-${index}`,
		date: event.eventDateTime,
		status: getEventTypeDescription(
			event.eventType,
			event.transportEventTypeCode ||
			event.shipmentEventTypeCode ||
			event.equipmentEventTypeCode,
		),
		location:
			event.transportCall?.location.locationName ||
			event.eventLocation?.locationName ||
			'Ubicación no disponible',
		vessel: event.transportCall?.vessel.vesselName,
		voyage: event.transportCall?.exportVoyageNumber,
		containerNumber: event.equipmentReference,
		eventType: event.eventType.toLowerCase() as
			| 'transport'
			| 'shipment'
			| 'equipment',
		completed: true,
	})).filter(e =>
		!e.status.toLowerCase().includes('documento')
	);

	return {
		trackingNumber: trackingNum,
		status: 'En tránsito',
		origin: events[0]?.location || 'Origen no disponible',
		destination: events[events.length - 1]?.location || 'Destino no disponible',
		estimatedArrival: formatDate(
			events[events.length - 1]?.date || new Date().toISOString(),
		),
		carrier: 'Hapag-Lloyd',
		events: events.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		),
	};
};
