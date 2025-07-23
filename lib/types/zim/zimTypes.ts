export interface ZimRouteLeg {
	legOrder: number;
	departurePortName: string;
	departurePort: string;
	departureDate: string;
	arrivalPortName: string;
	arrivalPort: string;
	arrivalDate: string;
	line: string;
	vesselName: string;
	vesselCode: string;
	lloydsCode: string | null;
	callSign: string | null;
	voyage: string;
	leg: string;
}

export interface ZimRoute {
	routeSequence: number;
	departurePort: string;
	departurePortName: string;
	departureDate: string;
	arrivalPort: string;
	arrivalPortName: string;
	arrivalDate: string;
	transitTime: number;
	routeLegCount: number;
	routeLegs: ZimRouteLeg[];
}

export interface ZimResponse {
	response: {
		routes: ZimRoute[];
	};
}

// Interfaces para ZIM API Tracking
interface ZimRouteDetail {
	arrivalDateTz: string | null;
	legOrder: number;
	portCodeFrom: string;
	countryCodeFrom: string;
	portNameTo: string;
	portCodeTo: string;
	voyage: string | null;
	leg: string | null;
	sailingDateDT: string | null;
	portNameFrom: string;
	vessel: string | null;
	countryNameTo: string;
	countryNameFrom: string;
	sailingDateTz: string | null;
	arrivalDateDT: string | null;
	countryCodeTo: string;
	vesselName: string | null;
}

interface ZimContainerEvent {
	countryCodePort: string;
	activityDate: string;
	port: string;
	vessel: string;
	eventName: string;
	portCode: string;
	countryPort: string;
	activityDateTz: string;
	vesselName: string;
	voyage: string;
	leg: string;
}

interface ZimContainer {
	containerNumber: string;
	containerTypeSize: string;
	containerEventsList: ZimContainerEvent[];
}

export interface ZimTrackingResult {
	finalETA: {
		etaDescription: string | null;
		etaValue: string;
		etaValueDate: string;
	};
	routeDetails: ZimRouteDetail[];
	bkBlDetails: {
		bookingReference: string;
		blReference: string;
		portOfLoading: string;
		portOfLoadingCode: string;
		portOfDischarge: string;
		portOfDischargeCode: string;
		countryNamePortOfLoading: string;
		countryNamePortOfDischarge: string;
		consContainerList: ZimContainer[];
		placeDeliveryCountryCode?: string | null;
		placeAcceptance?: string | null;
		countryCodePortOfDischarge?: string | null;
		countryCodePortOfLoading?: string | null;
		placeDelivery?: string | null;
		placeAcceptanceCode?: string | null;
		placeDeliveryCode?: string | null;
		placeAcceptanceCountryCode?: string | null;
		placeDeliveryCountryName?: string | null;
		countryNamePlaceAcceptance?: string | null;
		countryCodePlaceAcceptance?: string | null;
	};
}
