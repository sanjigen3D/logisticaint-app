import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, useAuthActions } from '../stores/auth.store';
import { useAuthCheck } from '../services/auth.service';

interface AuthContextType {
	user: any;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	login: (user: any, token: string) => Promise<void>;
	logout: () => Promise<void>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const authState = useAuth();
	const authActions = useAuthActions();

	// Usar solo el estado de carga del store
	const isLoading = authState.isLoading;

	const contextValue: AuthContextType = {
		...authState,
		...authActions,
		isLoading,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export const useAuthContext = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
	}
	return context;
};

// Hook para verificar si el usuario tiene permisos específicos
export const usePermissions = () => {
	const { user } = useAuthContext();

	const hasPermission = (requiredType: string): boolean => {
		if (!user) return false;

		// Jerarquía de permisos: Admin > Manager > User
		const hierarchy = {
			Admin: 3,
			Manager: 2,
			User: 1,
		};

		const userLevel = hierarchy[user.type as keyof typeof hierarchy] || 0;
		const requiredLevel =
			hierarchy[requiredType as keyof typeof hierarchy] || 0;

		return userLevel >= requiredLevel;
	};

	const isAdmin = () => hasPermission('Admin');
	const isManager = () => hasPermission('Manager');
	const isUser = () => hasPermission('User');

	return {
		hasPermission,
		isAdmin,
		isManager,
		isUser,
		userType: user?.type,
	};
};

// Componente para proteger rutas
interface ProtectedRouteProps {
	children: ReactNode;
	requiredPermission?: string;
	fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredPermission,
	fallback = null,
}) => {
	const { isAuthenticated, isLoading } = useAuthContext();
	const { hasPermission } = usePermissions();

	if (isLoading) {
		return <div>Cargando...</div>; // Puedes reemplazar con tu componente de loading
	}

	if (!isAuthenticated) {
		return <>{fallback}</>;
	}

	if (requiredPermission && !hasPermission(requiredPermission)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

// Componente para mostrar contenido solo a usuarios autenticados
interface AuthenticatedOnlyProps {
	children: ReactNode;
	fallback?: ReactNode;
}

export const AuthenticatedOnly: React.FC<AuthenticatedOnlyProps> = ({
	children,
	fallback = null,
}) => {
	const { isAuthenticated, isLoading } = useAuthContext();

	if (isLoading) {
		return <div>Cargando...</div>;
	}

	return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

// Componente para mostrar contenido solo a usuarios no autenticados
interface UnauthenticatedOnlyProps {
	children: ReactNode;
	fallback?: ReactNode;
}

export const UnauthenticatedOnly: React.FC<UnauthenticatedOnlyProps> = ({
	children,
	fallback = null,
}) => {
	const { isAuthenticated, isLoading } = useAuthContext();

	if (isLoading) {
		return <div>Cargando...</div>;
	}

	return !isAuthenticated ? <>{children}</> : <>{fallback}</>;
};
