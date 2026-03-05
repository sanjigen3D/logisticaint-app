import { getNavbarProps } from '@/components/UI/navbar/getNavbarProps';
import { ROUTES } from '@/lib/Routes';
import { LinearGradient } from 'expo-linear-gradient';
import {
	ExternalPathString,
	RelativePathString,
	router,
	usePathname,
} from 'expo-router';
import { Anchor, ArrowLeft } from 'lucide-react-native';
import { JSX, useMemo } from 'react';
import {
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export interface NavbarProps {
	title?: string;
	subtitle?: string;
	icon?: JSX.Element;
	colors?: string[];
	backButton?: boolean;
}

const Navbar = ({
	title,
	subtitle,
	icon,
	colors = ['#07174c', '#0f2d6b'],
	backButton = false,
}: NavbarProps) => {
	const pathname = usePathname();
	const navParams = getNavbarProps(pathname);

	if (pathname === ROUTES.ITINERARY_RESULT) {
		navParams.title = title;
		navParams.subtitle = subtitle;
		navParams.icon = icon;
	}

	const gradientColors = useMemo(() => {
		if (colors?.length >= 2) return colors.slice(0, 2);
		return ['#07174c', '#0f2d6b'];
	}, [colors]);

	const displayTitle = navParams.title || title;
	const displaySubtitle = navParams.subtitle || subtitle;

	return (
		<LinearGradient
			colors={[gradientColors[0], gradientColors[1]] as [string, string]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.header}
		>
			<View style={styles.topRow}>
				{backButton ? (
					<Pressable
						style={({ pressed }) => [
							styles.backButton,
							pressed && { opacity: 0.7 },
						]}
						onPress={() =>
							router.push(ROUTES.ITINERARY as RelativePathString | ExternalPathString)
						}
					>
						<View style={styles.backButtonInner}>
							<ArrowLeft size={20} color="#ffffff" />
						</View>
					</Pressable>
				) : (
					<View style={styles.brandMark}>
						<View style={styles.brandIconRing}>
							<Anchor size={14} color="#60a5fa" strokeWidth={2.5} />
						</View>
						<Text style={styles.brandText}>LOGISTICAINST</Text>
					</View>
				)}
			</View>

			<View style={styles.contentContainer}>
				<View style={styles.titleRow}>
					{navParams.icon || icon ? (
						<View style={styles.iconWrap}>{navParams.icon || icon}</View>
					) : null}
					{displayTitle ? (
						<Text style={styles.headerTitle} numberOfLines={2}>
							{displayTitle}
						</Text>
					) : null}
				</View>

				{displaySubtitle ? (
					<Text style={styles.headerSubtitle} numberOfLines={2}>
						{displaySubtitle}
					</Text>
				) : null}
			</View>

			<View style={styles.curveDivider} />
		</LinearGradient>
	);
};
export default Navbar;

const styles = StyleSheet.create({
	header: {
		paddingTop: Platform.OS === 'ios' ? 56 : 40,
		paddingBottom: 28, // Reduced from original 40/32, but more than the cramped 20
		overflow: 'visible',
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginBottom: 12,
	},
	brandMark: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	brandIconRing: {
		width: 28,
		height: 28,
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: 'rgba(96,165,250,0.5)',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(30,64,175,0.4)',
	},
	brandText: {
		fontFamily: 'Inter-Bold',
		fontSize: 11,
		color: 'rgba(255,255,255,0.6)',
		letterSpacing: 2.5,
	},
	backButton: {
		padding: 4,
		marginLeft: -4,
	},
	backButtonInner: {
		width: 38,
		height: 38,
		borderRadius: 12,
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	contentContainer: {
		paddingHorizontal: 24,
		alignItems: 'center',
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		marginBottom: 6,
	},
	iconWrap: {
		// No background box, just the clean icon
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 24, // Original was 28 (too big), compact was 16 (too small)
		fontFamily: 'Inter-Bold',
		color: '#ffffff',
		letterSpacing: 0.5,
		textAlign: 'center',
		flexShrink: 1,
	},
	headerSubtitle: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: 'rgba(191,219,254,0.9)',
		textAlign: 'center',
		lineHeight: 20,
		maxWidth: '90%',
	},
	curveDivider: {
		position: 'absolute',
		bottom: -1,
		left: 0,
		right: 0,
		height: 18,
		backgroundColor: '#f1f5f9',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
});
