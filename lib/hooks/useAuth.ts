import { useAuthStore } from '@/lib/stores/authStore';
import { useEffect } from 'react';

export const useAuth = () => {
	const {
		user,
		token,
		isAuthenticated,
		isLoading,
		error,
		login,
		logout,
		verifyToken,
		clearError,
		initializeAuth,
	} = useAuthStore();

	useEffect(() => {
		initializeAuth();
	}, []);

	return {
		user,
		token,
		isAuthenticated,
		isLoading,
		error,
		login,
		logout,
		verifyToken,
		clearError,
		isAdmin: user?.type === 'Admin',
		isManager: user?.type === 'Manager' || user?.type === 'Admin',
		isUser: user?.type === 'User',
	};
};
