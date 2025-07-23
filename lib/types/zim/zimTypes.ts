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
