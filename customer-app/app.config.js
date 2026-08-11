const fs = require('node:fs');
const path = require('node:path');

const projectRoot = __dirname;
const iosGoogleServicesPath = './GoogleService-Info.plist';
const androidGoogleServicesPath = './google-services.json';

const iosGoogleServicesExists = fs.existsSync(path.join(projectRoot, iosGoogleServicesPath));
const androidGoogleServicesExists = fs.existsSync(path.join(projectRoot, androidGoogleServicesPath));

module.exports = {
  expo: {
    name: 'Buza App',
    slug: 'buza-app',
    scheme: 'buza',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.officialkitter.buzaapp',
      ...(iosGoogleServicesExists ? { googleServicesFile: iosGoogleServicesPath } : {}),
    },
    android: {
      package: 'com.officialkitter.buzaapp',
      ...(androidGoogleServicesExists ? { googleServicesFile: androidGoogleServicesPath } : {}),
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-web-browser', 'expo-notifications'],
  },
};
