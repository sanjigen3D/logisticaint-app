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
};

const SuggestionsModal = ({
	suggestions,
	onSelectItem,
	iconColor,
}: SuggestionsModalProps) => {
	if (suggestions.length === 0) return null;

	return (
		<FlatList
			data={suggestions}
			keyExtractor={(item) => item.name + item.country}
			keyboardShouldPersistTaps="handled"
			renderItem={({ item, index }) => (
				<Pressable
					onPress={() => onSelectItem(item)}
					style={({ pressed }) => [
						styles.suggestionItem,
						index === suggestions.length - 1 && styles.lastItem,
						pressed && styles.suggestionItemPressed
					]}
				>
					<View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
						<Anchor size={18} color={iconColor} strokeWidth={2.5} />
					</View>
					<View style={styles.suggestionContent}>
						<Text style={styles.suggestionName}>
							{item.name}
						</Text>
						<View style={styles.countryRow}>
							<Text style={styles.suggestionCode}>{item.country}</Text>
							{item.location && (
								<>
									<View style={styles.dot} />
									<Text style={styles.suggestionCode}>{item.location}</Text>
								</>
							)}
						</View>
					</View>
				</Pressable>
			)}
		/>
	);
};

export default SuggestionsModal;

const styles = StyleSheet.create({
	suggestionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
		backgroundColor: '#ffffff',
	},
	lastItem: {
		borderBottomWidth: 0,
	},
	suggestionItemPressed: {
		backgroundColor: '#f8fafc',
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 14,
	},
	suggestionContent: {
		flex: 1,
		justifyContent: 'center',
	},
	suggestionName: {
		fontSize: 15,
		fontFamily: 'Inter-SemiBold',
		color: '#1e293b',
		marginBottom: 4,
		letterSpacing: 0.1,
	},
	countryRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	suggestionCode: {
		fontSize: 13,
		fontFamily: 'Inter-Medium',
		color: '#64748b',
		letterSpacing: 0.2,
	},
	dot: {
		width: 3,
		height: 3,
		borderRadius: 1.5,
		backgroundColor: '#cbd5e1',
		marginHorizontal: 6,
	},
});
