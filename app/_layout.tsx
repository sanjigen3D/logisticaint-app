import { Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from '@expo-google-fonts/inter';
import '@/assets/global.css';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import Navbar from '@/components/UI/navbar/navbar';
import { ROUTES } from '@/lib/Routes';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		'Inter-Regular': Inter_400Regular,
		'Inter-Medium': Inter_500Medium,
		'Inter-SemiBold': Inter_600SemiBold,
		'Inter-Bold': Inter_700Bold,
	});

	const path = usePathname();

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<QueryProvider>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.mainContainer}>
						{!path.includes(ROUTES.ITINERARY) && <Navbar />}
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
							<Stack.Screen
								name="(accounts)"
								options={{ headerShown: false }}
							/>
							<Stack.Screen name={'+not-found'} />
						</Stack>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</QueryProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		alignSelf: 'center',
	},
});
