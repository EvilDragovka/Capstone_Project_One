import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnix.app',
  appName: 'Learnix',
  webDir: 'out',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    }
  },
  server: {
    androidScheme: 'http',
    cleartext: true,
  }
};

export default config;
