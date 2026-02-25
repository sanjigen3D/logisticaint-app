import { ROUTES } from '@/lib/Routes';
import { Redirect } from 'expo-router';

export default function LoginDummy() {
    return <Redirect href={ROUTES.LOGIN as any} />;
}
