import { ROUTES } from '@/lib/Routes';
import { MyRoute } from "@/lib/types/types";
import {
	Building2,
	Contact2,
	LogIn,
	LogOut,
	LucideIcon,
	Package,
	Search,
	UserPlus
} from 'lucide-react-native';

type Carrier = {
	id: 'Hapag' | 'Zim';
	name: string;
	description: string;
	color: string;
	examples: string[];
};

export const CARRIERS: Carrier[] = [
	{
		id: 'Hapag' as const,
		name: 'Hapag-Lloyd',
		description: 'Números como HLCUGDN0000000',
		color: '#ef4444',
		examples: ['HLCUGDN0000000'],
	},
	{
		id: 'Zim' as const,
		name: 'ZIM Integrated Shipping',
		description: 'Números como ZIMUNNJ1011275',
		color: '#3b82f6',
		examples: ['ZIMUNNJ1011275'],
	},
];

export type QuickAction = {
	id: number;
	title: string;
	subtitle: string;
	icon: LucideIcon;
	color: string;
	route?: MyRoute;
	isLogOut?: boolean;
};

/************************  CONST de (tabs)  ***********************************/
export const quickActionsHome: QuickAction[] = [
	{
		id: 1,
		title: 'Itinerario',
		subtitle: 'Descubre los próximos envíos.',
		icon: Search,
		color: '#3b82f6',
		route: ROUTES.ITINERARY as MyRoute,
	},
	{
		id: 2,
		title: 'Tracking',
		subtitle: 'Sigue tu envío desde cualquier parte.',
		icon: Package,
		color: '#3b82f6',
		route: ROUTES.TRACKING as MyRoute,
	},
];

/************************  CONST de (accounts)  ***********************************/

export const quickActionLogOut: QuickAction[] = [
	{
		id: 46554,
		title: 'LogOut',
		subtitle: 'Cerrar Sesión',
		icon: LogOut,
		color: '#3b82f6',
		isLogOut: true,
	},
];

export const quickActionsAccount: QuickAction[] = [
	{
		id: 1,
		title: 'Iniciar Sesión',
		subtitle: 'Accede a tu cuenta',
		icon: LogIn,
		color: '#3b82f6',
		route: ROUTES.LOGIN as MyRoute,
	},
	{
		id: 2,
		title: 'Solicitar Cuenta',
		subtitle: 'Regístrate gratis',
		icon: UserPlus,
		color: '#10b981',
		route: ROUTES.REGISTER as MyRoute,
	},
];

/************************  CONST de (admin)  ***********************************/

export const quickActionsAdmin: QuickAction[] = [
	{
		id: 100,
		title: 'Crear Usuario',
		subtitle: 'Registrar nuevo usuario',
		icon: UserPlus,
		color: '#7c3aed',
		route: ROUTES.CREATE_USER as MyRoute,
	},
	{
		id: 101,
		title: 'Crear Empresa',
		subtitle: 'Registrar nueva empresa',
		icon: Building2,
		color: '#059669',
		route: ROUTES.CREATE_COMPANY as MyRoute,
	},
	{
		id: 102,
		title: 'Crear Contacto',
		subtitle: 'Agregar contacto a empresa',
		icon: Contact2,
		color: '#0284c7',
		route: ROUTES.CREATE_CONTACT as MyRoute,
	},
];

