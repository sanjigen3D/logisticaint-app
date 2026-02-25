import { QuickAction } from '@/lib/constants';
import { ROUTES } from '@/lib/Routes';
import { useAuthStore } from '@/lib/stores/authStore';
import { useToastStore } from '@/lib/stores/useToastStore';
import { MyRoute } from '@/lib/types/types';
import { router } from 'expo-router';
import { useRef } from 'react';
import {
	Animated,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

export const QuickMenuCard = ({
	quickAction,
}: {
	quickAction: QuickAction;
}) => {
	const { id, route, color, title, subtitle, isLogOut } = quickAction;
	const { logout } = useAuthStore();
	const { showToast } = useToastStore();

	// Press scale animation
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
			speed: 50,
			bounciness: 4,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
			speed: 30,
			bounciness: 6,
		}).start();
	};

	const handleQuickAction = (route?: MyRoute): void => {
		if (route) {
			return router.push(route);
		}

		if (isLogOut) {
			logout().then(() => {
				showToast({
					type: 'info',
					message: 'Sesión finalizada',
					description: 'Has cerrado sesión correctamente. ¡Hasta pronto!',
				});
				router.push(ROUTES.HOME as MyRoute);
			});
		}
	};

	// Derive a lighter tint for the gradient glow
	const glowColor = `${color}22`;
	const borderColor = `${color}40`;
	const iconBg = `${color}18`;

	return (
		<TouchableWithoutFeedback
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			onPress={() => handleQuickAction(route)}
		>
			<Animated.View
				style={[
					styles.card,
					{
						borderColor,
						shadowColor: color,
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				{/* Subtle top-left glow blob */}
				<View
					style={[styles.glowBlob, { backgroundColor: glowColor }]}
					pointerEvents="none"
				/>

				{/* Icon container */}
				<View style={[styles.iconContainer, { backgroundColor: iconBg, borderColor }]}>
					<quickAction.icon size={22} color={color} strokeWidth={2} />
				</View>

				<Text style={styles.cardTitle}>{title}</Text>
				<Text style={styles.cardSubtitle}>{subtitle}</Text>

				{/* Bottom accent line */}
				<View style={[styles.accentLine, { backgroundColor: color }]} />
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	card: {
		flex: 1,
		backgroundColor: '#ffffff',
		borderRadius: 20,
		padding: 18,
		alignItems: 'center',
		borderWidth: 1,
		overflow: 'hidden',
		// Elevation
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.18,
		shadowRadius: 14,
		elevation: 6,
	},
	glowBlob: {
		position: 'absolute',
		top: -10,
		left: -10,
		width: 60,
		height: 60,
		borderRadius: 30,
	},
	iconContainer: {
		width: 52,
		height: 52,
		borderRadius: 16,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
	},
	cardTitle: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#0f172a',
		marginBottom: 4,
		textAlign: 'center',
		letterSpacing: 0.1,
	},
	cardSubtitle: {
		fontSize: 12,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
		textAlign: 'center',
		lineHeight: 17,
	},
	accentLine: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 3,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		opacity: 0.7,
	},
});
