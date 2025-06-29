export interface ZimApiResponse {
	response: {
		routes: Route[];
	};
}

export interface Route {
	routeSequence: number;
	departurePort: string;
	departurePortName: string;
	departureDate: string; // ISO date string
	arrivalPort: string;
	arrivalPortName: string;
	arrivalDate: string; // ISO date string
	transitTime: number; // días
	routeLegCount: number;
	routeLegs: RouteLeg[];
}

export interface RouteLeg {
	legOrder: number;
	departurePortName: string;
	departurePort: string;
	departureDate: string; // ISO date string
	arrivalPortName: string;
	arrivalPort: string;
	arrivalDate: string; // ISO date string
	line: string;
	vesselName: string;
	vesselCode: string;
	lloydsCode: string | null;
	callSign: string | null;
	voyage: string;
	leg: string;
	consortSailingNumber: string | null;
	depotFrom: string;
	depotTo: string;
	docClosingDate: string | null;
	vgmClosingDate: string | null;
	firstGateInDate: string | null;
	containerClosingDate: string | null;
	hazardousDocsCutOff: string | null;
	amsClosingDate: string | null;
	reeferEntryPortCutOffDate: string | null;
	usDocClosingDate: string | null;
}
