import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View className={'flex-1 justify-center items-center p-4'}>
				<Text className={'text-xl font-semibold'}>Esta ventana no existe.</Text>
				<Link href={'/'} className={'mt-4 py-3.5'}>
					<Text>volver</Text>
				</Link>
			</View>
		</>
	);
}
