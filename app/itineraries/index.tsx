import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

interface Location {
	locationName: string;
	address: {
		city: string;
		countryCode: string;
	};
}

interface Leg {
	departure: {
		dateTime: string;
	};
	arrival: {
		dateTime: string;
	};
	transport: {
		servicePartners: ServicePartner[];
	};
}

interface ServicePartner {
	carrierCode: string;
	carrierServiceName: string;
}

interface RouteResult {
	transitTime: number;
	placeOfReceipt: {
		location: Location;
	};
	placeOfDelivery: {
		location: Location;
	};
	legs: Leg[];
}

export default function ResultsPage() {
	const { origin, destination } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [routes, setRoutes] = useState<RouteResult[]>([]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};


	useEffect(() => {
		fetchRouteData();
	}, [origin, destination]);

	const fetchRouteData = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`https://marines-services.vercel.app/itinerarySearch?origin=${encodeURIComponent(String(origin))}&destination=${encodeURIComponent(String(destination))}`
			);

			if (!response.ok) {
				throw new Error('Error al obtener los datos de la ruta');
			}

			const data: RouteResult[] = await response.json();
			setRoutes(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error desconocido');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#5a8ce8" />
				<Text className="mt-4 text-primary">Buscando rutas disponibles...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center p-4">
				<Text className="text-error text-center">{error}</Text>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 bg-white">
			<View className="p-4">
				<Text className="text-2xl font-bold text-primary mb-4">
					Rutas Disponibles ({routes.length})
				</Text>

				{routes.map((route, index) => {
					const carrier = route.legs[0]?.transport.servicePartners[0];
					const departureDate = route.legs[0]?.departure.dateTime;
					const arrivalDate = route.legs[0]?.arrival.dateTime;

					return (
						<View key={index} className="bg-blue-50 p-4 rounded-lg mb-4">
							<View className="space-y-2">
								<Text className="text-lg font-semibold text-primary">
									{carrier?.carrierServiceName || 'Naviera no especificada'}
								</Text>
								<Text className="text-base text-gray-600">
									Código: {carrier?.carrierCode || 'N/A'}
								</Text>

								<View className="mt-2">
									<Text className="font-medium">Origen:</Text>
									<Text>
										{route.placeOfReceipt.location.locationName}, {' '}
										{route.placeOfReceipt.location.address.city} ({route.placeOfReceipt.location.address.countryCode})
									</Text>
									<Text className="text-blue-600">
										Salida: {departureDate ? formatDate(departureDate) : 'No disponible'}
									</Text>
								</View>

								<View>
									<Text className="font-medium">Destino:</Text>
									<Text>
										{route.placeOfDelivery.location.locationName}, {' '}
										{route.placeOfDelivery.location.address.city} ({route.placeOfDelivery.location.address.countryCode})
									</Text>
									<Text className="text-blue-600">
										Llegada: {arrivalDate ? formatDate(arrivalDate) : 'No disponible'}
									</Text>
								</View>

								<Text className="text-lg font-semibold text-primary mt-2">
									Tiempo de tránsito: {route.transitTime} días
								</Text>
							</View>
						</View>
					);
				})}
			</View>
		</ScrollView>
	);
}
