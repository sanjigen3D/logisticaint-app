import { useAuthStore } from '@/lib/stores/authStore';
import { useEffect } from 'react';

export const useAuth = () => {
	const auth = useAuthStore();

	const isAdmin = () => auth.user?.type === 'Admin';
	const isManager = () => auth.user?.type === 'Manager';
	const isUser = () => auth.user?.type === 'User';

	const isManagerOrHigher = () => {
		return auth.user?.type === 'Admin' || auth.user?.type === 'Manager';
	};

	const hasRole = (role: string | string[]) => {
		if (typeof role === 'string') {
			return auth.user?.type === role;
		}
		return role.includes(auth.user?.type || '');
	};

	return {
		...auth,
		isAdmin,
		isManager,
		isUser,
		isManagerOrHigher,
		hasRole,
	};
};

export const useRequireAuth = () => {
	const auth = useAuth();

	useEffect(() => {
		if (!auth.isLoading && !auth.isAuthenticated) {
			// Navigation should be handled by the routing layer
		}
	}, [auth.isLoading, auth.isAuthenticated]);

	return auth;
};
