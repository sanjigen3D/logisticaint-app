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
	StyleSheet,
	Text,
	TouchableOpacity,
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

	// Esta ruta usa un navbar especial para mostrar más info
	if (pathname === ROUTES.ITINERARY_RESULT) {
		navParams.title = title;
		navParams.subtitle = subtitle;
		navParams.icon = icon;
	}

	const gradientColors = useMemo(() => {
		if (colors?.length >= 2) {
			return colors.slice(0, 2);
		}
		return ['#07174c', '#0f2d6b'];
	}, [colors]);

	return (
		<LinearGradient
			colors={[gradientColors[0], gradientColors[1]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.header}
		>
			{/* Top row: brand + back button */}
			<View style={styles.topRow}>
				{backButton ? (
					<TouchableOpacity
						style={styles.backButton}
						onPress={() =>
							router.push(
								ROUTES.ITINERARY as RelativePathString | ExternalPathString,
							)
						}
					>
						<View style={styles.backButtonInner}>
							<ArrowLeft size={18} color="#ffffff" />
						</View>
					</TouchableOpacity>
				) : (
					<View style={styles.brandMark}>
						<View style={styles.brandIconRing}>
							<Anchor size={14} color="#60a5fa" strokeWidth={2.5} />
						</View>
						<Text style={styles.brandText}>LOGISTICAINST</Text>
					</View>
				)}
			</View>

			{/* Main content */}
			<View style={styles.headerContent}>
				<View style={styles.iconWrap}>
					{navParams.icon || icon}
				</View>
				<Text style={styles.headerTitle}>{navParams.title || title}</Text>
				<Text style={styles.headerSubtitle}>
					{navParams.subtitle || subtitle}
				</Text>
			</View>

			{/* Curved divider at bottom */}
			<View style={styles.curveDivider} />
		</LinearGradient>
	);
};
export default Navbar;

const styles = StyleSheet.create({
	header: {
		paddingTop: Platform.OS === 'ios' ? 56 : 36,
		paddingBottom: 32,
		overflow: 'visible',
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		marginBottom: 16,
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
		color: 'rgba(255,255,255,0.55)',
		letterSpacing: 2.5,
	},
	accentDots: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	dot: {
		borderRadius: 99,
		backgroundColor: 'rgba(96,165,250,0.35)',
	},
	dotSm: { width: 4, height: 4 },
	dotMd: { width: 6, height: 6 },
	dotLg: { width: 8, height: 8, backgroundColor: 'rgba(96,165,250,0.5)' },
	backButton: {
		padding: 4,
	},
	backButtonInner: {
		width: 34,
		height: 34,
		borderRadius: 10,
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerContent: {
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	iconWrap: {
		width: 52,
		height: 52,
		borderRadius: 16,
		backgroundColor: 'rgba(59,130,246,0.2)',
		borderWidth: 1,
		borderColor: 'rgba(96,165,250,0.3)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	headerTitle: {
		fontSize: 22,
		fontFamily: 'Inter-Bold',
		color: '#ffffff',
		letterSpacing: 0.3,
		textAlign: 'center',
	},
	headerSubtitle: {
		fontSize: 13,
		fontFamily: 'Inter-Regular',
		color: 'rgba(191,219,254,0.85)',
		marginTop: 4,
		textAlign: 'center',
		lineHeight: 18,
	},
	curveDivider: {
		position: 'absolute',
		bottom: -1,
		left: 0,
		right: 0,
		height: 16,
		backgroundColor: '#f1f5f9',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
});
