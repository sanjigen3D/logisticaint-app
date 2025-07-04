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

// Nueva estructura (ZIM)
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

interface HapagAddress {
	street: string;
	streetNumber: string;
	floor: string;
	postCode: string;
	city: string;
	stateRegion: string;
	countryCode: string;
}

interface HapagFacility {
	facilityCode: string;
	facilityCodeListProvider: string;
}

interface HapagLocation {
	locationName: string;
	address: HapagAddress;
	UNLocationCode: string;
	facility: HapagFacility;
}

interface HapagPlace {
	facilityTypeCode: string;
	location: HapagLocation;
	dateTime: string;
}

interface HapagServicePartner {
	carrierCode: string;
	carrierCodeListProvider: string;
	carrierServiceName: string;
	carrierServiceCode: string;
	carrierImportVoyageNumber: string;
	carrierExportVoyageNumber: string;
}

interface HapagVessel {
	vesselIMONumber: string;
	MMSINumber: string;
	name: string;
	flag: string;
	callSign: string;
	operatorCarrierCode: string;
	operatorCarrierCodeListProvider: string;
}

interface HapagLeg {
	sequenceNumber: number;
	transport: {
		modeOfTransport: string;
		portVisitReference: string;
		transportCallReference: string;
		servicePartners: HapagServicePartner[];
		universalServiceReference: string;
		universalExportVoyageReference: string;
		universalImportVoyageReference: string;
		vessel: HapagVessel;
	};
	departure: HapagPlace;
	arrival: HapagPlace;
}

interface HapagCutOffTime {
	cutOffDateTimeCode: string;
	cutOffDateTime: string;
}

export interface HapagRoute {
	placeOfReceipt: HapagPlace;
	placeOfDelivery: HapagPlace;
	receiptTypeAtOrigin: string;
	deliveryTypeAtDestination: string;
	cutOffTimes: HapagCutOffTime[];
	solutionNumber: number;
	transitTime: number;
	legs: HapagLeg[];
}

export type HapagAPIResponse = HapagRoute[];

// Tipo unificado para mostrar en la UI
export interface UnifiedRoute {
	id: string;
	carrier: string;
	serviceName?: string;
	serviceCode?: string;
	transitTime: number;
	legs: Array<{
		vesselName: string;
		vesselCode?: string;
		imoNumber?: string;
		callSign?: string;
		voyage?: string;
		departure: {
			portName: string;
			portCode: string;
			city?: string;
			countryCode?: string;
			dateTime: string;
		};
		arrival: {
			portName: string;
			portCode: string;
			city?: string;
			countryCode?: string;
			dateTime: string;
		};
	}>;
}
