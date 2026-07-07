import { OneSignalService } from './oneSignalService';

export async function registerFCMToken(alias) {
  OneSignalService.login(alias);
}

export async function unregisterFCMToken(_alias) {
  OneSignalService.logout();
}
