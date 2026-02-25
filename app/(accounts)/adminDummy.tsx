import { ROUTES } from '@/lib/Routes';
import { Redirect, RelativePathString } from 'expo-router';

export default function AdminDummyAccount() {
    return <Redirect href={ROUTES.ADMIN as RelativePathString} />;
}
