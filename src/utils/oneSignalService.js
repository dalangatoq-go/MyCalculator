import { OneSignal, LogLevel } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '109bcc48-a286-438a-864c-7a92577c98b5';

// Pengiriman notifikasi dilakukan HANYA oleh Cloud Functions via FCM
// (Firestore trigger onPrivateMessageCreated → admin.messaging().send()).
// Client tidak perlu REST API Key — menghapusnya menghilangkan risiko
// key bocor lewat reverse-engineering APK.
export const OneSignalService = {
  initialize() {
    OneSignal.Debug.setLogLevel(LogLevel.Warn);
    OneSignal.initialize(ONESIGNAL_APP_ID);

    // Hanya minta izin sekali; jika user sudah pernah menjawab
    // (izinkan/tolak), OneSignal.Notifications.permission sudah true/false
    // dan kita tidak perlu memicu prompt lagi tiap app dibuka.
    OneSignal.Notifications.getPermissionAsync().then((granted) => {
      if (!granted) OneSignal.Notifications.requestPermission(true);
    });
  },

  login(alias) {
    if (!alias) return;
    OneSignal.login(alias.toLowerCase());
  },

  logout() {
    OneSignal.logout();
  },

  addForegroundNotificationListener(handler) {
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', handler);
    return () => OneSignal.Notifications.removeEventListener('foregroundWillDisplay', handler);
  },
};
