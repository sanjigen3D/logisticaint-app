import { UnifiedRoute } from '@/lib/interfaces';

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
