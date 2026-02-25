import { ROUTES } from '@/lib/Routes';
import { Redirect, RelativePathString } from 'expo-router';

export default function AccountDummy() {
    return <Redirect href={ROUTES.ACCOUNT as RelativePathString} />;
}
