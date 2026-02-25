import { ExternalPathString, Redirect, RelativePathString } from 'expo-router';
import { ROUTES } from '@/lib/Routes';

export default function BackToHome() {
	return (
		<Redirect href={ROUTES.HOME as ExternalPathString | RelativePathString} />
	);
}
