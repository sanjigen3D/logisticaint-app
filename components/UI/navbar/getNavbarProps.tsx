import { ROUTES } from '@/lib/Routes';
import {
	Home,
	UserPlus,
	LogIn,
	User,
	Ship,
	Package,
} from 'lucide-react-native';
import { NavbarProps } from '@/components/UI/navbar/navbar';

export function getNavbarProps(path: string): NavbarProps {
	if (path.includes(ROUTES.LOGIN)) {
		return {
			title: 'Mi Cuenta',
			subtitle: 'Gestiona tu cuenta y accede a funciones avanzadas',
			icon: <User size={40} color="#ffffff" />,
		};
	} else if (path.includes(ROUTES.REGISTER)) {
		return {
			title: 'Crear Cuenta',
			subtitle: 'solicita tu cuenta.',
			icon: <UserPlus size={32} color="#ffffff" />,
		};
	} else if (path.includes(ROUTES.ACCOUNT)) {
		return {
			title: 'Mi Cuenta',
			subtitle: 'Gestiona tu cuenta y accede a funciones avanzadas',
			icon: <User size={40} color="#ffffff" />,
		};
	} else if (path.includes(ROUTES.ITINERARY)) {
		return {
			title: 'Logisticainst-app',
			subtitle: 'Encuentre rutas entre puertos marítimos de todo el mundo',
			icon: <Ship size={32} color="#fff" />,
		};
	} else if (path.includes(ROUTES.TRACKING)) {
		return {
			title: 'Rastrear Envío',
			subtitle: 'Sigue tu paquete en tiempo real',
			icon: <Package size={32} color="#ffffff" />,
		};
	} else {
		return {
			title: 'Logisticainst-app',
			subtitle: 'Encuentre rutas entre puertos marítimos de todo el mundo',
			icon: <Ship size={40} color={'#fff'} />,
		};
	}
}
