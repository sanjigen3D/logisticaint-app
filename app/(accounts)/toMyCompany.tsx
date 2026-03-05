import { useAuth } from '@/lib/hooks/useAuth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AccountsToCompany() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#059669" />
            </View>
        );
    }

    return <Redirect href={`/(admin)/company/${user.company_id}` as any} />;
}
