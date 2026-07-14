import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { OneSignalService } from './oneSignalService';

/**
 * Push notification (FCM) benar-benar dikirim oleh Cloud Function
 * `onPrivateMessageCreated`, yang membaca token dari Firestore
 * `fcm_tokens/{alias}` (lihat firestore.rules & functions/index.js).
 *
 * Fungsi di bawah ini bertugas MEMBUAT token itu ada:
 * 1. Minta izin notifikasi (no-op bila sudah granted sebelumnya).
 * 2. Ambil device token FCM.
 * 3. Simpan token ke `fcm_tokens/{alias}` sesuai skema yang diizinkan rules
 *    (hanya field `token`).
 *
 * OneSignal tetap dipakai terpisah, hanya untuk permission-prompt/alias —
 * TIDAK untuk pengiriman notif (lihat oneSignalService.js).
 */
async function ensureNotificationPermission() {
  const status = await messaging().hasPermission();
  const alreadyGranted =
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL;

  if (alreadyGranted) return true;

  const requested = await messaging().requestPermission();
  return (
    requested === messaging.AuthorizationStatus.AUTHORIZED ||
    requested === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function registerFCMToken(alias) {
  if (!alias) return;

  // Login OneSignal (tetap dipertahankan — dipakai untuk permission prompt/alias)
  OneSignalService.login(alias);

  const granted = await ensureNotificationPermission();
  if (!granted) {
    console.warn('[notifications] Izin notifikasi ditolak, token FCM tidak didaftarkan.');
    return;
  }

  const token = await messaging().getToken();
  if (!token) {
    console.warn('[notifications] Gagal mendapatkan token FCM.');
    return;
  }

  await firestore()
    .collection('fcm_tokens')
    .doc(alias.toLowerCase())
    .set({ token });

  // Jika token FCM berganti (reinstall, clear data, dsb.), simpan ulang otomatis.
  messaging().onTokenRefresh(async newToken => {
    try {
      await firestore()
        .collection('fcm_tokens')
        .doc(alias.toLowerCase())
        .set({ token: newToken });
    } catch (err) {
      console.warn('[notifications] Gagal menyimpan token FCM baru:', err?.message);
    }
  });
}

export async function unregisterFCMToken(_alias) {
  // Sengaja TIDAK menghapus token dari Firestore maupun logout OneSignal —
  // notifikasi harus tetap masuk meski UI kembali ke tampilan kalkulator
  // (lihat AuthContext.signOut). Fungsi ini dipertahankan sebagai
  // titik ekstensi bila perilaku ini ingin diubah di masa depan.
  OneSignalService.logout();
}
