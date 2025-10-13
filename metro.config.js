const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// // Configurar para Zustand
// config.resolver.alias = {
// 	...config.resolver.alias,
// 	'zustand/middleware': 'zustand/middleware',
// };

config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './assets/global.css' });
