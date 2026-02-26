import { Port } from '@/lib/types/types';
import { Anchor } from 'lucide-react-native';
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

type SuggestionsModalProps = {
	suggestions: Port[];
	onSelectItem: (item: Port) => void;
	iconColor: string;
	setSuggestions: (suggestions: Port[]) => void;
};

const SuggestionsModal = ({
	suggestions,
	onSelectItem,
	iconColor,
	setSuggestions,
}: SuggestionsModalProps) => {
	if (suggestions.length === 0) return null;

	return (
		<FlatList
			style={styles.suggestionList}
			data={suggestions}
			keyExtractor={(item) => item.name + item.country}
			renderItem={({ item }) => (
				<Pressable
					onPress={() => {
						onSelectItem(item);
						setSuggestions([]);
					}}
					style={({ pressed }) => [
						styles.suggestionItem,
						pressed && { backgroundColor: '#f1f5f9' }
					]}
				>
					<Anchor size={16} color={iconColor} />
					<View style={styles.suggestionContent}>
						<Text style={styles.suggestionName}>
							{item.name}, {item.country}
						</Text>
						<View className="flex flex-row">
							<Text style={styles.suggestionCode}>{item.country}</Text>
							<Text style={styles.suggestionCode}>{item.location}</Text>
						</View>
					</View>
				</Pressable>
			)}
		/>
	);
};

export default SuggestionsModal;

const styles = StyleSheet.create({
	suggestionList: {
		maxHeight: 200,
	},
	suggestionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
	},
	suggestionContent: {
		marginLeft: 12,
		flex: 1,
	},
	suggestionName: {
		fontSize: 16,
		fontFamily: 'Inter-Medium',
		color: '#1e293b',
		marginBottom: 2,
	},
	suggestionCode: {
		fontSize: 14,
		fontFamily: 'Inter-Regular',
		color: '#64748b',
	},
});
