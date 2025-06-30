import { ZimResponse, UnifiedRoute } from '@/lib/interfaces';

export function mapZimResponseToUnifiedRoutes(
	data: ZimResponse,
): UnifiedRoute[] {
	return data.response.routes.map((route) => ({
		id: `ZIM-${route.routeSequence}`,
		carrier: 'ZIM',
		transitTime: route.transitTime,
		legs: route.routeLegs.map((leg) => ({
			vesselName: leg.vesselName,
			vesselCode: leg.vesselCode.trim(),
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
		})),
	}));
}
