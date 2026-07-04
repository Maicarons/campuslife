import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.campuslife.app',
  appName: 'CampusLife',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.2.2:5173',
    cleartext: true,
  },
}

export default config
