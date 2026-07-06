import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Ref navigasi global — dipakai agar notif bisa navigasi dari luar React tree
export const navigationRef = React.createRef();

/**
 * Handler background/quit — HARUS didefinisikan di luar komponen React.
 * Dipanggil saat app di background atau tertutup.
 */
messaging().setBackgroundMessageHandler(async () => {
  // Pesan diproses silent; navigasi ditangani di onNotificationOpenedApp
  // atau getInitialNotification saat user tap notif.
});

export default function App() {
  const routeNameRef = useRef();

  useEffect(() => {
    // ── 1. Pesan FOREGROUND (app sedang terbuka) ──────────────────
    const unsubForeground = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification || {};
      const data = remoteMessage.data || {};

      // Tampilkan alert tersamar — sama persis dengan notif system
      Alert.alert(
        title || 'MyCalculator Pro',
        body  || 'APK membutuhkan pembaruan. Ketuk untuk memperbarui.',
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Perbarui', onPress: () => navigateToChat(data) },
        ],
      );
    });

    // ── 2. App di BACKGROUND → user tap notif ────────────────────
    const unsubBackground = messaging().onNotificationOpenedApp(remoteMessage => {
      navigateToChat(remoteMessage?.data || {});
    });

    // ── 3. App DITUTUP → user tap notif → app dibuka ─────────────
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        setTimeout(() => navigateToChat(remoteMessage.data || {}), 500);
      }
    });

    return () => {
      unsubForeground();
      unsubBackground();
    };
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

/**
 * Navigasi ke ChatRoom berdasarkan data payload FCM.
 * data = { type, roomId, senderAlias, roomTitle }
 */
function navigateToChat(data) {
  if (data?.type !== 'message' || !data?.roomId) return;
  navigationRef.current?.navigate('ChatRoom', {
    roomType:  'private',
    contactId: data.roomId,
    roomTitle: data.roomTitle || data.senderAlias || 'Chat',
  });
}
