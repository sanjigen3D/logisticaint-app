/************* Itinerario  *********************/

interface maerskServicePartners {
	carrierCode: string;
	carrierServiceName: string;
	carrierServiceCode: string;
}

export interface MaerskShippingLeg {
	sequenceNumber: number;
	transport: {
		modeOfTransport: string;
		servicePartners: maerskServicePartners[];
		vessel: {
			vesselIMONumber: string;
			name: string;
			flag: string;
		};
	};
	departure: {
		location: {
			locationName: string;
			address: {
				city: string;
				countryCode: string;
			};
		};
		dateTime: string;
	};
	arrival: {
		location: {
			locationName: string;
			address: {
				city: string;
				countryCode: string;
			};
		};
		dateTime: string;
	};
}

export interface MaerskShippingRoute {
	solutionNumber: number;
	transitTime: number;
	legs: MaerskShippingLeg[];
}

export interface MaerskAPIResponse {
	oceanProducts: MaerskShippingRoute[];
}

/********************** Tracking ********************/
