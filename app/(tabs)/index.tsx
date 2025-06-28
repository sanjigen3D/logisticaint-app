import {
	Platform,
	KeyboardAvoidingView,
	ScrollView,
	View,
	Text,
} from 'react-native';
import PortSearchForm from '@/components/forms/itinery/PortSearchForm';
import { LinearGradient } from 'expo-linear-gradient';
import { Ship } from 'lucide-react-native';

export default function Index() {
	return (
		<KeyboardAvoidingView
			className="flex flex-1 bg-[#f8fafc]"
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				className="flex-1"
				contentContainerClassName="grow"
			>
				{/* Header */}
				<LinearGradient
					colors={['#1e40af', '#3b82f6']}
					className={Platform.OS === 'ios' ? 'pt-16 pb-10' : 'py-10'}
				>
					<View className="container self-center px-5">
						<View className="items-center">
							<View className="flex flex-row items-center space-x-4">
								<Ship size={32} color="#fff" />
								<Text
									style={{ fontFamily: 'Inter-Bold' }}
									className="text-white text-2xl mt-2"
								>
									Logisticainst-app
								</Text>
							</View>
							<Text
								className="text-base text-[#bfdbfe] mt-1 text-center"
								style={{ fontFamily: 'Inter-Regular' }}
							>
								Encuentre rutas entre puertos marítimos de todo el mundo
							</Text>
						</View>
					</View>
				</LinearGradient>

				{/* Contenido Buscar Itinerario por ahora */}
				<View className="container max-w-5xl w-full flex mx-auto">
					<View className="pt-5 md:pt-10">
						<PortSearchForm />
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
