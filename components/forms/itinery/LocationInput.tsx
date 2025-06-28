import SuggestionsModal from '@/components/forms/itinery/SuggestModal';
import { MapPin } from 'lucide-react-native';
import {
	Controller,
	type Control,
	FieldError,
	Merge,
	FieldErrorsImpl,
} from 'react-hook-form';
import {
	ActivityIndicator,
	TextInput,
	View,
	Text,
	StyleSheet,
} from 'react-native';
import { FormData, Port } from '@/lib/types';

type LocationInputProps = {
	control: Control<FormData>;
	name: 'origin' | 'destination';
	placeholder: string;
	iconColor: string;
	loading: boolean;
	suggestions: Port[];
	setSuggestions: (suggestions: Port[]) => void;
	setQuery: (query: string) => void;
	error?:
		| FieldError
		| Merge<FieldError, FieldErrorsImpl<{ name: string; country: string }>>
		| undefined;
};

const LocationInput = ({
	control,
	name,
	placeholder,
	iconColor,
	loading,
	suggestions,
	setSuggestions,
	setQuery,
	error,
}: LocationInputProps) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value } }) => (
				<View className="relative">
					<View
						style={styles.inputWrapper}
						className="items-center bg-[#f8fafc] flex flex-row"
					>
						<View style={{ marginRight: 12 }}>
							<MapPin size={20} color={iconColor} />
						</View>
						<TextInput
							style={{
								fontFamily: 'Inter-Regular',
								outline: 'none',
							}}
							className="flex flex-1 text-base text-[#1e293b] placeholder:text-foreground pl-4"
							onChangeText={(text) => {
								onChange({ ...value, name: text });
								setQuery(text);
							}}
							value={value.name}
							placeholder={placeholder}
							autoCorrect={false}
							autoCapitalize="none"
						/>
						{loading && <ActivityIndicator size="small" color="#5a8ce8" />}
					</View>
					{error && (
						<Text className="text-error font-semibold">
							{error.message?.toString()}
						</Text>
					)}
					<SuggestionsModal
						suggestions={suggestions}
						onSelectItem={(item: Port) => {
							// Pasamos el objeto Port completo a onChange
							onChange(item);
							setQuery(item.name);
						}}
						iconColor={iconColor}
						setSuggestions={setSuggestions}
					/>
				</View>
			)}
		/>
	);
};

export default LocationInput;

const styles = StyleSheet.create({
	inputWrapper: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingVertical: 14,
		paddingHorizontal: 12,
	},
});
