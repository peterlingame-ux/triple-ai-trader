import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c5b8ad01acc14427bf648b3b15b1e715',
  appName: 'triple-ai-trader',
  webDir: 'dist',
  server: {
    url: 'https://c5b8ad01-acc1-4427-bf64-8b3b15b1e715.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e293b',
      showSpinner: true,
      spinnerColor: '#fbbf24'
    }
  }
};

export default config;