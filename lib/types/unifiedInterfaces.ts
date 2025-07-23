// Tipo unificado para mostrar en la UI de itinerario
interface UnifiedLeg {
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
}
export interface UnifiedRoute {
	id: string;
	carrier: string;
	serviceName?: string;
	serviceCode?: string;
	transitTime: number;
	legs: UnifiedLeg[];
}

// Tipos unificado para el apartado de tracking
export interface UnifiedTrackingEvent {
	id: string;
	date: string;
	status: string;
	location: string;
	vessel?: string;
	voyage?: string;
	containerNumber?: string;
	eventType: 'transport' | 'shipment' | 'equipment' | 'container';
	completed: boolean;
}

interface UnifiedTrackingContainer {
	number: string;
	type: string;
	events: UnifiedTrackingEvent[];
}

interface UnifiedTrackingRouteDetails {
	from: string;
	to: string;
	vessel: string;
	departure: string;
	arrival: string;
	voyage: string;
}

export interface UnifiedTrackingData {
	trackingNumber: string;
	status: string;
	origin: string;
	destination: string;
	estimatedArrival: string;
	carrier: string;
	events: UnifiedTrackingEvent[];
	containers?: UnifiedTrackingContainer[];
	routeDetails?: UnifiedTrackingRouteDetails[];
}
