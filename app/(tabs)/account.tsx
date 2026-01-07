import { Redirect, RelativePathString } from 'expo-router';
import { ROUTES } from '@/lib/Routes';

export default function AccountDummy() {
	return <Redirect href={ROUTES.ACCOUNT_DUMMY as RelativePathString} />;
}
