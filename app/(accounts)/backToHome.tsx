import { ExternalPathString, Redirect, RelativePathString } from 'expo-router';
import { ROUTES } from '@/lib/Routes';
import React from 'react';

export default function BackToHome() {
	return (
		<Redirect href={ROUTES.HOME as ExternalPathString | RelativePathString} />
	);
}
