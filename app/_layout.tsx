import { Stack } from 'expo-router';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		'Inter-Regular': Inter_400Regular,
		'Inter-Medium': Inter_500Medium,
		'Inter-SemiBold': Inter_600SemiBold,
		'Inter-Bold': Inter_700Bold,
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<QueryClientProvider client={new QueryClient()}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="tabs" options={{ headerShown: false }} />
				<Stack.Screen name="account" options={{ headerShown: false }} />
				<Stack.Screen name={'+not-found'} />
			</Stack>
		</QueryClientProvider>
	);
}
