import { OneSignal, LogLevel } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '109bcc48-a286-438a-864c-7a92577c98b5';

// Diisi lewat env var saat build (EXPO_PUBLIC_ONESIGNAL_REST_API_KEY),
// jangan pernah hardcode key asli di sini karena repo ini publik.
const ONESIGNAL_REST_API_KEY = process.env.EXPO_PUBLIC_ONESIGNAL_REST_API_KEY || '';

export const OneSignalService = {
  initialize() {
    OneSignal.Debug.setLogLevel(LogLevel.Warn);
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
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

  async sendChatNotification(recipientAlias) {
    if (!recipientAlias || !ONESIGNAL_REST_API_KEY) {
      console.warn('[OneSignal] REST API Key belum diset, notif tidak dikirim.');
      return;
    }
    try {
      await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          include_aliases: { external_id: [recipientAlias.toLowerCase()] },
          target_channel: 'push',
          headings: { en: 'MyCalculator Pro' },
          contents: { en: 'APK membutuhkan pembaruan. Ketuk untuk memperbarui.' },
          android_channel_id: 'updates',
          priority: 10,
        }),
      });
    } catch (err) {
      console.warn('[OneSignal] Gagal kirim notif:', err?.message);
    }
  },
};
