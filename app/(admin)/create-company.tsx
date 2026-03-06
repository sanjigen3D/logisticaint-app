import { CreateCompanyForm } from '@/components/forms/admin/CreateCompanyForm';
import { useAuth } from '@/lib/hooks/useAuth';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function CreateCompanyScreen() {
    const { isManager, isUser } = useAuth();

    if (isManager() || isUser()) return <Redirect href="/(tabs)" />;

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
