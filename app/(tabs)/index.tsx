import { quickActionsHome } from '@/lib/constants';
import QuickMenu from '@/components/UI/Tabs/QuickMenu';

export default function Index() {
	return <QuickMenu quickActions={quickActionsHome} />;
}

