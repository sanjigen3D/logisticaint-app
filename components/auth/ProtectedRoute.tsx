import { ReactNode, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/lib/stores/authStore';
import { router } from 'expo-router';
import { ROUTES } from '@/lib/Routes';

interface ProtectedRouteProps {
	children: ReactNode;
	requireAuth?: boolean;
	requiredRole?: 'Admin' | 'Manager' | 'User';
	redirectTo?: string;
}

export const ProtectedRoute = ({
	children,
	requireAuth = true,
	requiredRole,
	redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) => {
	const { isAuthenticated, isLoading, user } = useAuthStore();

	useEffect(() => {
		if (!isLoading && requireAuth && !isAuthenticated) {
			router.replace(redirectTo);
		}

		if (
			!isLoading &&
			isAuthenticated &&
			requiredRole &&
			user?.type !== requiredRole &&
			!(requiredRole === 'Manager' && user?.type === 'Admin')
		) {
			router.replace(ROUTES.HOME);
		}
	}, [isAuthenticated, isLoading, requireAuth, user, requiredRole, redirectTo]);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#3b82f6" />
			</View>
		);
	}

	if (requireAuth && !isAuthenticated) {
		return null;
	}

	if (
		requiredRole &&
		user?.type !== requiredRole &&
		!(requiredRole === 'Manager' && user?.type === 'Admin')
	) {
		return null;
	}

	return <>{children}</>;
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
	},
});
