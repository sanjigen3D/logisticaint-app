import { CreateCompanyForm } from '@/components/forms/admin/CreateCompanyForm';
import { StyleSheet, View } from 'react-native';

export default function CreateCompanyScreen() {
    return (
        <View style={styles.container}>
            <CreateCompanyForm />
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
