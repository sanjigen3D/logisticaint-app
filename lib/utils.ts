// función para obtener el tipo de la descripción en el apartado de tracking
export const getEventTypeDescription = (
	eventType: string,
	eventCode?: string,
) => {
	const eventMap: { [key: string]: string } = {
		ARRI: 'Llegada al puerto',
		DEPA: 'Salida del puerto',
		LOAD: 'Contenedor cargado',
		DISC: 'Contenedor descargado',
		ISSU: 'Documento emitido',
		TRANSPORT: 'Evento de transporte',
		SHIPMENT: 'Evento de envío',
		EQUIPMENT: 'Evento de contenedor',
	};
	return eventMap[eventCode || eventType] || eventType;
};

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('es-ES', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};
