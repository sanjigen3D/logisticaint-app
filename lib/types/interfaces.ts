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
