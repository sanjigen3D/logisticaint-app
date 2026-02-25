import { CreateContactForm } from '@/components/forms/admin/CreateContactForm';
import { StyleSheet, View } from 'react-native';

export default function CreateContactScreen() {
    return (
        <View style={styles.container}>
            <CreateContactForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        maxWidth: 1024,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
});
