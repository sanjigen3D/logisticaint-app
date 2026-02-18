import { quickActionsAccount } from '@/lib/constants';
import QuickMenu from '@/components/UI/Tabs/QuickMenu';


export default function AccountHomeScreen() {
		return (
		<QuickMenu quickActions={quickActionsAccount} />
	);
}