import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnix.app',
  appName: 'Learnix',
  webDir: 'out',
  server: {
    androidScheme: 'http',
    cleartext: true,
  }
};

export default config;
