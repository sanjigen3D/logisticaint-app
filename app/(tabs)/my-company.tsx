import { useAuth } from '@/lib/hooks/useAuth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function MyCompanyProxy() {
    const { user, isAuthenticated } = useAuth();

    // If not authenticated or still loading, don't attempt routing yet
    if (!isAuthenticated || !user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#059669" />
            </View>
        );
    }

    // Redirect straight to the company dashboard detail screen using the layout's context.
    return <Redirect href={`/(admin)/company/${user.company_id}` as any} />;
}
