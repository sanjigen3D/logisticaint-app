/************* Itinerario  *********************/

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

/************* Tracking  *********************/

export interface HapagEvent {
	eventCreatedDateTime: string;
	eventType: 'TRANSPORT' | 'SHIPMENT' | 'EQUIPMENT';
	eventClassifierCode: string;
	eventDateTime: string;
	transportEventTypeCode?: string;
	shipmentEventTypeCode?: string;
	equipmentEventTypeCode?: string;
	equipmentReference?: string;
	documentID?: string;
	documentTypeCode?: string;
	transportCall?: {
		transportCallID: string;
		exportVoyageNumber: string;
		importVoyageNumber: string;
		UNLocationCode: string;
		facilityTypeCode: string;
		modeOfTransport: string;
		location: {
			locationName: string;
			UNLocationCode: string;
			address: {
				name: string;
			};
		};
		vessel: {
			vesselIMONumber: string;
			vesselName: string;
		};
	};
	eventLocation?: {
		locationName: string;
		UNLocationCode: string;
		address: {
			name: string;
		};
	};
}
