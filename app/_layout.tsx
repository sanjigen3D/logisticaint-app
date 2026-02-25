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

	return (
		<QueryProvider>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<View style={styles.main}>
					{!path.includes(ROUTES.ITINERARY_RESULT) && <Navbar />}
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="(accounts)" options={{ headerShown: false }} />
						<Stack.Screen name={'+not-found'} />
					</Stack>
				</View>
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
	main: {
		flex: 1,
		width: '100%',
		alignSelf: 'center',
	},
});
