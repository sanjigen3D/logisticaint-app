import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import {
	Anchor,
	ArrowDown,
	Calendar,
	Clock,
	MapPin,
	Ship,
} from 'lucide-react-native';
import { UnifiedRoute } from '@/lib/interfaces';

type Props = {
	route: UnifiedRoute;
};

const ResultCard = ({ route }: Props) => {
	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A';

		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<View style={styles.routeCard} className={'mt-6'}>
			{/* Carrier Header */}
			<View style={styles.carrierHeader}>
				<View style={styles.carrierInfo}>
					<Anchor size={20} color="#1e40af" />
					<Text style={styles.carrierName}>{route.carrier}</Text>
				</View>
				<View style={styles.transitBadge}>
					<Clock size={14} color="#059669" />
					<Text style={styles.transitTime}>{route.transitTime} días</Text>
				</View>
			</View>

			{/* Service Info (si existe) */}
			{route.serviceName && (
				<View style={styles.serviceInfo}>
					<Text style={styles.serviceName}>{route.serviceName}</Text>
					{route.serviceCode && (
						<Text style={styles.serviceCode}>Código: {route.serviceCode}</Text>
					)}
				</View>
			)}

			{/* Route Legs */}
			<View style={styles.routeLegsContainer}>
				{route.legs.map((leg, legIndex) => (
					<View key={legIndex}>
						{/* Vessel Info */}
						<View style={styles.vesselContainer}>
							<View style={styles.vesselHeader}>
								<Ship size={16} color="#3b82f6" />
								<Text style={styles.vesselName}>{leg.vesselName}</Text>
								{leg.vesselCode && (
									<Text style={styles.vesselCode}>{leg.vesselCode}</Text>
								)}
							</View>
							<View style={styles.vesselDetails}>
								{leg.imoNumber && (
									<Text style={styles.vesselDetail}>IMO: {leg.imoNumber}</Text>
								)}
								{leg.callSign && (
									<Text style={styles.vesselDetail}>
										Call Sign: {leg.callSign}
									</Text>
								)}
								{leg.voyage && (
									<Text style={styles.vesselDetail}>Voyage: {leg.voyage}</Text>
								)}
							</View>
						</View>

						{/* Leg Route Details */}
						<View style={styles.legRouteDetails}>
							<View style={styles.routePoint}>
								<MapPin size={16} color="#10b981" />
								<View style={styles.routePointInfo}>
									<Text style={styles.routePointName}>
										{leg.departure.portName}
									</Text>
									{leg.departure.city && leg.departure.countryCode && (
										<Text style={styles.routePointCity}>
											{leg.departure.city}, {leg.departure.countryCode}
										</Text>
									)}
									<View style={styles.dateContainer}>
										<Calendar size={12} color="#64748b" />
										<Text style={styles.dateText}>
											Salida: {formatDate(leg.departure.dateTime)}
										</Text>
									</View>
								</View>
							</View>

							<View style={styles.routeArrow}>
								<View style={styles.arrowLine} />
							</View>

							<View style={styles.routePoint}>
								<MapPin size={16} color="#ef4444" />
								<View style={styles.routePointInfo}>
									<Text style={styles.routePointName}>
										{leg.arrival.portName}
									</Text>
									{leg.arrival.city && leg.arrival.countryCode && (
										<Text style={styles.routePointCity}>
											{leg.arrival.city}, {leg.arrival.countryCode}
										</Text>
									)}
									<View style={styles.dateContainer}>
										<Calendar size={12} color="#64748b" />
										<Text style={styles.dateText}>
											Llegada: {formatDate(leg.arrival.dateTime)}
										</Text>
									</View>
								</View>
							</View>
						</View>

						{/* Separator between legs */}
						{legIndex < route.legs.length - 1 && (
							<View style={styles.legSeparator}>
								<View style={styles.legSeparatorLine} />
								<View style={styles.legSeparatorContent}>
									<View style={styles.legSeparatorIcon}>
										<ArrowDown size={16} color="#64748b" />
									</View>
									<Text style={styles.legSeparatorText}>Escala</Text>
								</View>
								<View style={styles.legSeparatorLine} />
							</View>
						)}
					</View>
				))}
			</View>
		</View>
	);
};
export default ResultCard;

const styles = StyleSheet.create({
	routeCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	carrierHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	carrierInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	carrierName: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginLeft: 8,
	},
	transitBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#dcfce7',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	transitTime: {
		fontSize: 14,
		fontFamily: 'Inter-SemiBold',
		color: '#059669',
		marginLeft: 4,
	},
	serviceInfo: {
		marginBottom: 16,
	},
	serviceName: {
		fontSize: 16,
		fontFamily: 'Inter-Medium',
		color: '#475569',
		marginBottom: 2,
	},
	serviceCode: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	routeLegsContainer: {
		marginTop: 8,
	},
	vesselContainer: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
	},
	vesselHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	vesselName: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginLeft: 8,
		flex: 1,
	},
	vesselCode: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#3b82f6',
		backgroundColor: '#dbeafe',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	vesselDetails: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: 24,
	},
	vesselDetail: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#94a3b8',
		marginRight: 16,
		marginBottom: 2,
	},
	legRouteDetails: {
		marginBottom: 8,
	},
	routePoint: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	routePointInfo: {
		marginLeft: 12,
		flex: 1,
	},
	routePointName: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 2,
	},
	routePointCity: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		marginBottom: 4,
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dateText: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginLeft: 4,
	},
	routeArrow: {
		alignItems: 'center',
		marginVertical: 8,
	},
	arrowLine: {
		width: 2,
		height: 20,
		backgroundColor: '#cbd5e1',
	},
	legSeparator: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 16,
	},
	legSeparatorLine: {
		flex: 1,
		height: 1,
		backgroundColor: '#e2e8f0',
	},
	legSeparatorIcon: {
		backgroundColor: '#f1f5f9',
		borderRadius: 16,
		padding: 8,
		marginHorizontal: 12,
		elevation: 5,
	},
	legSeparatorText: {
		fontSize: 12,
		fontFamily: 'Inter-SemiBold',
		color: '#64748b',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	legSeparatorContent: {
		alignItems: 'center',
		marginHorizontal: 1,
	},
});
