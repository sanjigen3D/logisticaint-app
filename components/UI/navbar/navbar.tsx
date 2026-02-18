import {
	View,
	Text,
	StyleSheet,
	Platform,
	TouchableOpacity,
} from 'react-native';
import { JSX, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import {
	ExternalPathString,
	RelativePathString,
	router,
	usePathname,
} from 'expo-router';
import { getNavbarProps } from '@/components/UI/navbar/getNavbarProps';
import { ROUTES } from '@/lib/Routes';

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
	colors = ['#07174c', '#0b3477'],
	backButton = false,
}: NavbarProps) => {
	const pathname = usePathname();

	const navParams = getNavbarProps(pathname);

	// esta ruta usa un navbar especial para mostrar más info
	if (pathname === ROUTES.ITINERARY_RESULT) {
		navParams.title = title;
		navParams.subtitle = subtitle;
		navParams.icon = icon;
	}

	// Usar useMemo para calcular los colores del gradiente una sola vez
	const gradientColors = useMemo(() => {
		// Sí hay al menos 2 colores, tomar los primeros 2
		if (colors?.length >= 2) {
			return colors.slice(0, 2);
		}
		return ['#07174c', '#0b3477'];
	}, [colors]);

	return (
		<LinearGradient
			colors={[gradientColors[0], gradientColors[1]]}
			style={styles.header}
		>
			<View style={styles.headerContainer}>
				{backButton && (
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => router.push(ROUTES.ITINERARY as RelativePathString | ExternalPathString)}
					>
						<ArrowLeft size={24} color="#ffffff" />
					</TouchableOpacity>
				)}
				<View style={styles.headerContent}>
					<View className={'flex flex-row items-center space-x-4'}>
						{navParams.icon || icon}
						<Text style={styles.headerTitle}>{navParams.title || title}</Text>
					</View>
					<Text style={styles.headerSubtitle}>
						{navParams.subtitle || subtitle}
					</Text>
				</View>
			</View>
		</LinearGradient>
	);
};
export default Navbar;

const styles = StyleSheet.create({
	header: {
		paddingTop: Platform.OS === 'ios' ? 60 : 40,
		paddingBottom: 40,
	},
	headerContainer: {
		width: '100%',
		maxWidth: 1200,
		alignSelf: 'center',
		paddingHorizontal: 20,
	},
	headerContent: {
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 28,
		fontFamily: 'Inter-Bold',
		color: '#ffffff',
		marginTop: 8,
	},
	headerSubtitle: {
		fontSize: 16,
		fontFamily: 'Inter-Regular',
		color: '#bfdbfe',
		marginTop: 4,
		textAlign: 'center',
	},
	backButton: {
		position: 'absolute',
		left: 20,
		top: 0,
		zIndex: 10,
		padding: 8,
	},
});
