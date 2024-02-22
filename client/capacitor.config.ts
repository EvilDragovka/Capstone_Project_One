import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnix.app',
  appName: 'Learnix',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
