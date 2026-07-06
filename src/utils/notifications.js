import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

/**
 * Minta izin notifikasi ke user (wajib di iOS, opsional di Android 13+).
 * Return true jika izin diberikan.
 */
export async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

/**
 * Ambil FCM token perangkat dan simpan ke Firestore di koleksi fcm_tokens.
 * Dipanggil setelah login berhasil.
 * @param {string} alias - alias user yang sedang login (e.g. "SanQua")
 */
export async function registerFCMToken(alias) {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.warn('[FCM] Izin notifikasi ditolak');
      return;
    }

    const token = await messaging().getToken();
    if (!token) return;

    const aliasKey = alias.toLowerCase();
    await firestore().collection('fcm_tokens').doc(aliasKey).set({
      token,
      alias,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log('[FCM] Token tersimpan untuk:', aliasKey);
  } catch (err) {
    console.error('[FCM] Gagal simpan token:', err?.message);
  }
}

/**
 * Hapus FCM token dari Firestore saat logout.
 * @param {string} alias
 */
export async function unregisterFCMToken(alias) {
  try {
    const aliasKey = alias.toLowerCase();
    await firestore().collection('fcm_tokens').doc(aliasKey).delete();
    console.log('[FCM] Token dihapus untuk:', aliasKey);
  } catch (err) {
    console.error('[FCM] Gagal hapus token:', err?.message);
  }
}
