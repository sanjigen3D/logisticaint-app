import '@/assets/global.css';
import Navbar from '@/components/UI/navbar/navbar';
import { GlobalToast } from '@/components/UI/toast/GlobalToast';
import { useAuth } from '@/lib/hooks/useAuth';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { ROUTES } from '@/lib/Routes';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
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
	const { verifyToken, isLoading } = useAuth();

	useEffect(() => {
		verifyToken();
	}, []);

	useEffect(() => {
		if ((fontsLoaded || fontError) && !isLoading) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError, isLoading]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	// Determines whether the current route is a main tab (not accounts/login/etc.)
	const isTabRoute =
		!path.includes('accounts') &&
		!path.includes('login') &&
		!path.includes('register');

	return (
		<QueryProvider>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={[
						styles.scrollContent,
						// Add extra bottom padding when on tab routes so content doesn't
						// hide behind the floating tab bar (68px bar + 16px bottom + buffer)
						isTabRoute && styles.scrollContentTabPadding,
					]}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.mainContainer}>
						{!path.includes(ROUTES.ITINERARY_RESULT) && <Navbar />}
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
			<GlobalToast />
		</QueryProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f1f5f9',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	// Adds bottom padding when floating tab bar is visible
	scrollContentTabPadding: {
		paddingBottom: 104,
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		alignSelf: 'center',
	},
});
