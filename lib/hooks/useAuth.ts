import { useAuthStore } from '@/lib/stores/authStore';

const SUPER_ADMIN_COMPANY_NAME = 'sanjigen';

export const useAuth = () => {
	const auth = useAuthStore();

	const isAdmin = () => auth.user?.type === 'Admin';
	const isManager = () => auth.user?.type === 'Manager';
	const isUser = () => auth.user?.type === 'User';

	const isManagerOrHigher = (): boolean => {
		return auth.user?.type === 'Admin' || auth.user?.type === 'Manager';
	};

	const isSuperAdmin = (): boolean => {
		return !!auth.user?.company_name?.toLowerCase().includes(SUPER_ADMIN_COMPANY_NAME);
	};

	const hasRole = (role: string | string[]) => {
		if (typeof role === "string") {
			return auth.user?.type === role;
		}

		return role.includes(auth.user?.type || "");
	};

	const getRoleWeight = (roleType?: string, companyName?: string) => {
		if (companyName?.toLowerCase().includes(SUPER_ADMIN_COMPANY_NAME)) return 4;
		switch (roleType) {
			case 'Admin': return 3;
			case 'Manager': return 2;
			case 'User': return 1;
			default: return 0;
		}
	};

	const canEditUser = (targetUser: { id: number; type: string; company_name?: string }) => {
		if (!auth.user) return false;

		if (targetUser.id === auth.user.id) return false;

		const myWeight = getRoleWeight(auth.user.type, auth.user.company_name);
		const targetWeight = getRoleWeight(targetUser.type, targetUser.company_name);

		// Supremacia: SuperAdmins pueden tocar a cualquiera
		if (myWeight === 4) return true;

		// Jerarquía Normal: Puedo editar sólo si mi peso es mayor o igual al del objetivo
		return myWeight >= targetWeight;
	};

	return {
		...auth,
		isAdmin,
		isManager,
		isUser,
		isManagerOrHigher,
		isSuperAdmin,
		hasRole,
		getRoleWeight,
		canEditUser
	}
}

export const useRequireAuth = () => {
	const auth = useAuth();

	return auth;
}