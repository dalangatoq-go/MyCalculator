import { Alert } from 'react-native';
import { OneSignal, LogLevel } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '109bcc48-a286-438a-864c-7a92577c98b5';

const ONESIGNAL_REST_API_KEY = '__ONESIGNAL_REST_API_KEY__';

let dialogShown = false;

function isRegistered(subscriptionId) {
  return !!subscriptionId && !subscriptionId.startsWith('local-');
}

function maybeShowIntegrationCompleteDialog(subscriptionId) {
  if (isRegistered(subscriptionId) && !dialogShown) {
    dialogShown = true;
    Alert.alert(
      'Your OneSignal SDK integration is complete!',
      'You can now send Push Notifications & In-App Messages through OneSignal. Tap below to enable push notifications.',
      [{ text: 'Got it', onPress: () => OneSignal.Notifications.requestPermission(true) }],
      { cancelable: false },
    );
  }
}

export const OneSignalService = {
  initialize() {
    OneSignal.Debug.setLogLevel(LogLevel.Warn);
    OneSignal.initialize(ONESIGNAL_APP_ID);

    OneSignal.User.pushSubscription.addEventListener('change', (subscription) => {
      maybeShowIntegrationCompleteDialog(subscription.current.id);
    });
    OneSignal.User.pushSubscription.getIdAsync().then(maybeShowIntegrationCompleteDialog);
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
    if (!recipientAlias || ONESIGNAL_REST_API_KEY.startsWith('GANTI_')) return;
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
