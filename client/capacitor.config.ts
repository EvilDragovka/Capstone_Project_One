import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnix.app',
  appName: 'Learnix',
  webDir: 'out',
  server: {
    url: "http://52.13.109.29",
    cleartext: true,
  }
};

export default config;
