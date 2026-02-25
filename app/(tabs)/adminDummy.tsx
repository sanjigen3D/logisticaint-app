import { ROUTES } from '@/lib/Routes';
import { Redirect, RelativePathString } from 'expo-router';

export default function AdminDummy() {
    return <Redirect href={ROUTES.ADMIN as RelativePathString} />;
}
