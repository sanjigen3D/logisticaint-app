import {
	LogIn,
	LucideIcon,
	Package,
	Search,
	UserPlus,
} from 'lucide-react-native';
import { ROUTES } from '@/lib/Routes';
import { ExternalPathString, RelativePathString } from 'expo-router';

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
	route: ExternalPathString | RelativePathString;
};

/************************  CONST de (tabs)  ***********************************/
export const quickActionsHome: QuickAction[] = [
	{
		id: 1,
		title: 'Itinerario',
		subtitle: 'Descubre los próximos envíos.',
		icon: Search,
		color: '#3b82f6',
		route: ROUTES.ITINERARY as ExternalPathString | RelativePathString,
	},
	{
		id: 2,
		title: 'Tracking',
		subtitle: 'Sigue tu envío desde cualquier parte.',
		icon: Package,
		color: '#3b82f6',
		route: ROUTES.TRACKING as ExternalPathString | RelativePathString,
	},
];

/************************  CONST de (accounts)  ***********************************/

export const quickActionsAccount: QuickAction[] = [
	{
		id: 1,
		title: 'Iniciar Sesión',
		subtitle: 'Accede a tu cuenta',
		icon: LogIn,
		color: '#3b82f6',
		route: ROUTES.LOGIN as ExternalPathString | RelativePathString,
	},
	{
		id: 2,
		title: 'Solicitar Cuenta',
		subtitle: 'Regístrate gratis',
		icon: UserPlus,
		color: '#10b981',
		route: ROUTES.REGISTER as ExternalPathString | RelativePathString,
	},
];
