import { UnifiedTrackingData } from '@/lib/types/unifiedInterfaces';
import { formatDate } from '@/lib/utils';
import {
	Box,
	Calendar,
	CircleCheck as CheckCircle,
	ChevronDown,
	ChevronUp,
	Clock,
	MapPin,
	Ship,
} from 'lucide-react-native';
import { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const TrackingResult = ({
	trackingData,
	expandedContainers,
	setExpandedContainers,
}: {
	trackingData: UnifiedTrackingData | null;
	expandedContainers: Set<string>;
	setExpandedContainers: Dispatch<SetStateAction<Set<string>>>;
}) => {
	// Show the container details when the container number is clicked
	const toggleContainerExpansion = (containerNumber: string) => {
		setExpandedContainers((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(containerNumber)) {
				newSet.delete(containerNumber);
			} else {
				newSet.add(containerNumber);
			}
			return newSet;
		});
	};

	return (
		<View style={styles.resultsCard}>
			<Text style={styles.resultsTitle}>Estado del Envío</Text>

			{/* Carrier Info */}
			<View style={styles.carrierContainer}>
				<Text style={styles.carrierName}>{trackingData?.carrier}</Text>
				<Text style={styles.trackingNumber}>
					{trackingData?.trackingNumber}
				</Text>
			</View>

			{/* Status Bar */}
			<View style={styles.statusContainer}>
				<View style={styles.statusBadge}>
					<Text style={styles.statusText}>{trackingData?.status}</Text>
				</View>
			</View>

			{/* ORIGEN - DESTINO - FECHA LLEGADA */}
			<View style={styles.routeContainer}>
				<View style={styles.routeItem}>
					<MapPin size={16} color="#10b981" />
					<Text style={styles.routeText}>Origen: {trackingData?.origin}</Text>
				</View>
				<View style={styles.routeItem}>
					<MapPin size={16} color="#ef4444" />
					<Text style={styles.routeText}>
						Destino: {trackingData?.destination}
					</Text>
				</View>
				<View style={styles.routeItem}>
					<Clock size={16} color="#3b82f6" />
					<Text style={styles.routeTextDate}>
						Llegada estimada: {trackingData?.estimatedArrival}
					</Text>
				</View>
			</View>

			{/* Route Details (for ZIM) */}
			{trackingData?.routeDetails && (
				<View style={styles.routeDetailsContainer}>
					<Text style={styles.sectionTitle}>Detalles de la Ruta</Text>
					{trackingData.routeDetails.map((route, index) => (
						<View key={index} style={styles.routeDetailCard}>
							<View style={styles.routeDetailHeader}>
								<Ship size={16} color="#3b82f6" />
								<Text style={styles.vesselName}>{route.vessel}</Text>
								<Text style={styles.voyageNumber}>Voyage: {route.voyage}</Text>
							</View>
							<View style={styles.routeDetailContent}>
								<Text style={styles.routeDetailText}>
									{route.from} → {route.to}
								</Text>
								<Text style={styles.routeDetailDates}>
									{formatDate(route.departure)} - {formatDate(route.arrival)}
								</Text>
							</View>
						</View>
					))}
				</View>
			)}

			{/* Timeline */}
			<View style={styles.timelineContainer}>
				<Text style={styles.timelineTitle}>Historial de Seguimiento</Text>
				{trackingData?.events.map((event) => (
					<View key={event.id} style={styles.timelineItem}>
						<View
							style={[
								styles.timelineIcon,
								event.completed && styles.timelineIconCompleted,
							]}
						>
							{event.completed ? (
								<CheckCircle size={16} color="#10b981" />
							) : (
								<View style={styles.timelineIconEmpty} />
							)}
						</View>
						<View style={styles.timelineContent}>
							<Text
								style={[
									styles.timelineStatus,
									event.completed && styles.timelineStatusCompleted,
								]}
							>
								{event.status}
							</Text>
							<Text style={styles.timelineLocation}>{event.location}</Text>
							<View style={styles.timelineDetails}>
								<Calendar size={12} color="#64748b" />
								<Text style={styles.timelineDate}>
									{formatDate(event.date)}
								</Text>
							</View>
							{event.vessel && (
								<Text style={styles.timelineVessel}>
									Barco: {event.vessel}{' '}
									{event.voyage && `- Voyage: ${event.voyage}`}
								</Text>
							)}
							{event.containerNumber && (
								<Text style={styles.timelineContainer}>
									Contenedor: {event.containerNumber}
								</Text>
							)}
						</View>
					</View>
				))}
			</View>

			{/* Container Information (for ZIM) */}
			{trackingData?.containers && trackingData?.containers.length > 0 && (
				<View style={styles.containersContainer}>
					<Text style={styles.sectionTitle}>
						Contenedores ({trackingData.containers.length})
					</Text>
					{trackingData.containers.map((container) => (
						<View key={container.number} style={styles.containerCard}>
							<Pressable
								style={({ pressed }) => [
									styles.containerHeader,
									pressed && { backgroundColor: '#e2e8f0' }
								]}
								onPress={() => toggleContainerExpansion(container.number)}
							>
								<View style={styles.containerHeaderContent}>
									<Box size={16} color="#3b82f6" />
									<Text style={styles.containerNumber}>{container.number}</Text>
									<Text style={styles.containerType}>{container.type}</Text>
								</View>
								{expandedContainers.has(container.number) ? (
									<ChevronUp size={16} color="#64748b" />
								) : (
									<ChevronDown size={16} color="#64748b" />
								)}
							</Pressable>

							{expandedContainers.has(container.number) && (
								<View style={styles.containerEvents}>
									{container.events.map((event) => (
										<View key={event.id} style={styles.containerEvent}>
											<View
												style={[
													styles.eventIcon,
													event.completed && styles.eventIconCompleted,
												]}
											>
												{event.completed ? (
													<CheckCircle size={12} color="#10b981" />
												) : (
													<View style={styles.eventIconEmpty} />
												)}
											</View>
											<View style={styles.containerEventContent}>
												<Text style={styles.containerEventStatus}>
													{event.status}
												</Text>
												<Text style={styles.containerEventLocation}>
													{event.location}
												</Text>
												<Text style={styles.containerEventDate}>
													{formatDate(event.date)}
												</Text>
												{event.vessel && (
													<Text style={styles.containerEventVessel}>
														Barco: {event.vessel} - Voyage: {event.voyage}
													</Text>
												)}
											</View>
										</View>
									))}
								</View>
							)}
						</View>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	carrierName: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#0f172a',
		marginBottom: 2,
	},
	resultsCard: {
		backgroundColor: '#ffffff',
		borderRadius: 24,
		padding: 24,
		marginTop: 16,
		marginHorizontal: 20,
		shadowColor: '#0f172a',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 16,
		elevation: 6,
		borderWidth: 1,
		borderColor: '#f1f5f9',
	},
	resultsTitle: {
		fontSize: 17,
		fontFamily: 'Inter-SemiBold',
		color: '#0f172a',
		marginBottom: 16,
		letterSpacing: 0.2,
	},
	statusContainer: {
		alignItems: 'center',
		marginBottom: 24,
	},
	statusBadge: {
		backgroundColor: '#dcfce7',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	statusText: {
		fontSize: 16,
		fontFamily: 'Inter-SemiBold',
		color: '#16a34a',
	},
	routeContainer: {
		marginBottom: 24,
	},
	routeItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	routeText: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		marginLeft: 12,
		flex: 1,
	},
	routeTextDate: {
		fontSize: 14,
		fontFamily: 'Inter-Bold',
		color: '#403838',
		marginLeft: 12,
		flex: 1,
	},
	sectionTitle: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
		marginTop: 24,
	},
	routeDetailsContainer: {
		marginTop: 24,
	},
	routeDetailCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
	},
	routeDetailHeader: {
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
	voyageNumber: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		backgroundColor: '#e2e8f0',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	routeDetailContent: {
		marginLeft: 24,
	},
	routeDetailText: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#475569',
		marginBottom: 4,
	},
	routeDetailDates: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	containersContainer: {
		marginTop: 24,
	},
	containerCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		marginBottom: 12,
		overflow: 'hidden',
	},
	containerHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	containerHeaderContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	containerNumber: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginLeft: 8,
		flex: 1,
	},
	containerType: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		backgroundColor: '#e2e8f0',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	containerEvents: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	containerEvent: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	eventIcon: {
		width: 20,
		height: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		backgroundColor: '#f1f5f9',
		marginTop: 2,
	},
	eventIconCompleted: {
		backgroundColor: '#dcfce7',
	},
	eventIconEmpty: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#cbd5e1',
	},
	containerEventContent: {
		flex: 1,
	},
	containerEventStatus: {
		fontSize: 14,
		fontFamily: 'Inter-Medium',
		color: '#1e293b',
		marginBottom: 2,
	},
	containerEventLocation: {
		fontSize: 13,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		marginBottom: 2,
	},
	containerEventDate: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginBottom: 2,
	},
	containerEventVessel: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
	timelineTitle: {
		fontSize: 18,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 16,
	},
	timelineItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	timelineIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		backgroundColor: '#f1f5f9',
	},
	timelineIconCompleted: {
		backgroundColor: '#dcfce7',
	},
	timelineIconEmpty: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#cbd5e1',
	},
	timelineContent: {
		flex: 1,
	},
	timelineStatus: {
		fontSize: 16,
		fontFamily: 'Inter-Medium',
		color: '#64748b',
		marginBottom: 4,
	},
	timelineStatusCompleted: {
		color: '#1e293b',
	},
	timelineLocation: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#475569',
		marginBottom: 4,
	},
	timelineDetails: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	timelineDate: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginLeft: 4,
	},
	timelineVessel: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		marginBottom: 2,
	},
	timelineContainer: {
		marginTop: 24,
		fontSize: 14,
		fontFamily: 'Inter-SemiBold',
		color: '#475569',
	},
	carrierContainer: {
		marginBottom: 16,
	},
	trackingNumber: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
});
