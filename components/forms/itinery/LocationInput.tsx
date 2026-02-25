import SuggestionsModal from '@/components/forms/itinery/SuggestModal';
import { FormData, Port } from '@/lib/types/types';
import { MapPin } from 'lucide-react-native';
import {
	Controller,
	FieldError,
	FieldErrorsImpl,
	Merge,
	type Control,
} from 'react-hook-form';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

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
				<View>
					<View
						style={[
							styles.inputWrapper,
							error ? styles.inputWrapperError : null,
						]}
					>
						<View style={styles.iconWrap}>
							<MapPin size={18} color={iconColor} />
						</View>
						<TextInput
							style={styles.textInput}
							onChangeText={(text) => {
								if (!text) {
									onChange({ name: '', country: '' });
								} else {
									onChange({ ...value, name: text });
								}
								setQuery(text);
							}}
							value={value.name}
							placeholder={placeholder}
							placeholderTextColor="#94a3b8"
							autoCorrect={false}
							autoCapitalize="none"
						/>
						{loading && (
							<ActivityIndicator size="small" color="#3b82f6" style={{ marginLeft: 8 }} />
						)}
					</View>
					{error && (
						<Text style={styles.errorText}>
							{error.message?.toString()}
						</Text>
					)}
					<SuggestionsModal
						suggestions={suggestions}
						onSelectItem={(item: Port) => {
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
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 14,
		borderWidth: 1.5,
		borderColor: '#e2e8f0',
		paddingVertical: 14,
		paddingHorizontal: 14,
	},
	inputWrapperError: {
		borderColor: '#ef4444',
		backgroundColor: '#fef2f2',
	},
	iconWrap: {
		marginRight: 10,
	},
	textInput: {
		flex: 1,
		fontFamily: 'Inter-Regular',
		fontSize: 15,
		color: '#0f172a',
	},
	errorText: {
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		color: '#ef4444',
		marginTop: 4,
		marginLeft: 2,
	},
});
