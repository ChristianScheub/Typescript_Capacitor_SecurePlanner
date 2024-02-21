import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.scheub.securePlanner',
  appName: 'Secure-Planner',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Filesystem: {
      androidPermissions: [
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE'
      ]
    }
  }
  
};

export default config;
