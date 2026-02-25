import { QuickAction } from '@/lib/constants';
import { ROUTES } from '@/lib/Routes';
import { useAuthStore } from '@/lib/stores/authStore';
import { useToastStore } from '@/lib/stores/useToastStore';
import { MyRoute } from '@/lib/types/types';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
	Animated,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export const QuickMenuCard = ({
	quickAction,
	cardWidth,
}: {
	quickAction: QuickAction;
	cardWidth: number;
}) => {
	const { id, route, color, title, subtitle, isLogOut } = quickAction;
	const { logout } = useAuthStore();
	const { showToast } = useToastStore();

	const [isHovered, setIsHovered] = useState(false);

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
		<Pressable
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			onPress={() => handleQuickAction(route)}
			onHoverIn={() => setIsHovered(true)}
			onHoverOut={() => setIsHovered(false)}
			style={[
				{ width: cardWidth },
				Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
			]}
		>
			<Animated.View
				style={[
					styles.card,
					{
						borderColor,
						shadowColor: color,
						transform: [{ scale: scaleAnim }],
					},
					isHovered && styles.cardHovered,
				]}
			>
				{/* Icon container */}
				<View style={[styles.iconContainer, { backgroundColor: iconBg, borderColor }]}>
					<quickAction.icon size={22} color={color} strokeWidth={2} />
				</View>

				<Text style={styles.cardTitle}>{title}</Text>
				<Text style={styles.cardSubtitle}>{subtitle}</Text>

				{/* Bottom accent line */}
				<View style={[styles.accentLine, { backgroundColor: color }]} />
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		flex: 1,
		minHeight: 140,
		backgroundColor: '#ffffff',
		borderRadius: 20,
		padding: 18,
		alignItems: 'center',
		borderWidth: 1,
		overflow: 'hidden',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.18,
		shadowRadius: 14,
		elevation: 6,
	},
	cardHovered: {
		shadowOpacity: 0.32,
		shadowRadius: 20,
		elevation: 12,
		// @ts-ignore — valid on RN Web
		outline: 'none',
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
