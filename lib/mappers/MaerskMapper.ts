import { UnifiedRoute } from '@/lib/types/unifiedInterfaces'; // Usa tu ruta correcta

export function mapMaerskToUnified(maerskJson: any): UnifiedRoute[] {
	return maerskJson.oceanProducts.map((product: any, index: number) => {
		const carrier = product.vesselOperatorCarrierCode || 'Maersk';
		const transitTime =
			parseInt(product.transportSchedules[0].transitTime, 10) / 60; // de minutos a horas/días, ajusta según necesites

		const legs = product.transportSchedules.flatMap((schedule: any) => {
			return schedule.transportLegs.map((leg: any) => ({
				vesselName: leg.transport.vessel.vesselName,
				vesselCode: leg.transport.vessel.carrierVesselCode,
				imoNumber: leg.transport.vessel.vesselIMONumber,
				voyage: leg.transport.carrierDepartureVoyageNumber,
				departure: {
					portName: leg.facilities.startLocation.locationName,
					portCode: leg.facilities.startLocation.UNLocationCode,
					city: leg.facilities.startLocation.cityName,
					countryCode: leg.facilities.startLocation.countryCode,
					dateTime: leg.departureDateTime,
				},
				arrival: {
					portName: leg.facilities.endLocation.locationName,
					portCode: leg.facilities.endLocation.UNLocationCode,
					city: leg.facilities.endLocation.cityName,
					countryCode: leg.facilities.endLocation.countryCode,
					dateTime: leg.arrivalDateTime,
				},
			}));
		});

		return {
			id: `${carrier}-${index}`,
			carrier,
			serviceName:
				product.transportSchedules[0].transportLegs[0].transport
					.carrierServiceName,
			serviceCode:
				product.transportSchedules[0].transportLegs[0].transport
					.carrierServiceCode,
			transitTime,
			legs,
		};
	});
}
