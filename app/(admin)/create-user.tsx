import { CreateUserForm } from '@/components/forms/admin/CreateUserForm';
import { StyleSheet, View } from 'react-native';

export default function CreateUserScreen() {
    return (
        <View style={styles.container}>
            <CreateUserForm />
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
