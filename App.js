import React, { useEffect } from 'react';
import { Alert, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Handler background/quit — HARUS di luar komponen React.
 * Dipanggil saat app di background/mati dan notif diterima.
 * Tidak ada navigasi — biarkan app membuka layar terakhirnya.
 */
messaging().setBackgroundMessageHandler(async () => {
  // Proses silent. Saat user tap notif, Android akan membuka
  // app secara normal dari awal (Calculator) atau foreground
  // dari state terakhir. Tidak ada navigasi paksa ke chat.
});

function AppContent() {
  const { isLoadingSession } = React.useContext(AuthContext);

  useEffect(() => {
    // ── Notif FOREGROUND (app sedang terbuka) ────────────────────
    // Tampilkan sebagai alert "update" — tidak ada tombol ke chat
    const unsubForeground = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification || {};
      Alert.alert(
        title || 'MyCalculator Pro',
        body  || 'APK membutuhkan pembaruan. Ketuk untuk memperbarui.',
        [{ text: 'OK' }],
      );
    });

    // ── Notif BACKGROUND/KILLED → user tap ───────────────────────
    // Android membuka app secara alami — tidak ada navigate paksa.
    // Tidak perlu handler khusus; biarkan sistem yang handle.
    messaging().onNotificationOpenedApp(() => {
      // Sengaja kosong — app terbuka ke Calculator atau Dashboard
      // sesuai state terakhir. User masuk lewat kode seperti biasa.
    });

    messaging().getInitialNotification().then(() => {
      // Sengaja kosong — sama seperti di atas.
    });

    return () => unsubForeground();
  }, []);

  // Tampilkan layar kosong gelap selama sesi dipulihkan dari storage
  // agar layar kalkulator tidak "kedip" muncul lalu langsung loncat ke dashboard
  if (isLoadingSession) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#333" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
