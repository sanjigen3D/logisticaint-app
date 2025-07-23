import { UnifiedRoute } from '@/lib/types/interfaces';
import { ZimResponse } from '@/lib/types/zim/zimTypes';

export function mapZimResponseToUnifiedRoutes(
	data: ZimResponse,
): UnifiedRoute[] {
	if (!data.response.routes) return [];
	return data.response.routes.map((route) => ({
		id: `ZIM-${route.routeSequence}`,
		carrier: 'ZIM',
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
