import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { router } from 'expo-router';
import { ROUTES } from '@/lib/Routes';

interface UseRequireAuthOptions {
	requireAuth?: boolean;
	requiredRole?: 'Admin' | 'Manager' | 'User';
	redirectTo?: string;
}

export const useRequireAuth = ({
	requireAuth = true,
	requiredRole,
	redirectTo = ROUTES.LOGIN,
}: UseRequireAuthOptions = {}) => {
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

	return {
		isAuthenticated,
		isLoading,
		user,
		hasRequiredRole:
			!requiredRole ||
			user?.type === requiredRole ||
			(requiredRole === 'Manager' && user?.type === 'Admin'),
	};
};
