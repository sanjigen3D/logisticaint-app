import { Platform, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import PortSearchForm from '@/components/forms/itinery/PortSearchForm';
import Navbar from '@/components/UI/navbar/navbar';
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
