import { ROUTES } from '@/lib/Routes';
import { Redirect, RelativePathString } from 'expo-router';

export default function HomeDummy() {
    return <Redirect href={ROUTES.HOME as RelativePathString} />;
}
