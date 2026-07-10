/**
 * Pengiriman push notification langsung dari client via OneSignal REST API.
 *
 * CATATAN KEAMANAN: karena Firebase Cloud Functions tidak bisa dipakai
 * (project belum di paket Blaze / tidak ada kartu pembayaran), notifikasi
 * dikirim langsung dari aplikasi memakai ONESIGNAL_REST_API_KEY yang
 * ikut ter-bundle di APK. Siapa pun yang membongkar APK bisa menemukan
 * key ini dan memakainya untuk mengirim notifikasi arbitrer ke semua
 * pengguna terdaftar di app OneSignal ini. Kalau nanti project sudah
 * bisa pakai Firebase Functions (atau server lain), pindahkan logika ini
 * ke sana dan cabut key ini dari OneSignal dashboard, lalu buat yang baru.
 *
 * Key TIDAK di-hardcode/commit ke git (GitHub push protection akan
 * menolaknya). Diisi lewat variabel EXPO_PUBLIC_ONESIGNAL_REST_API_KEY,
 * yang di-inline oleh Metro/Expo saat build:
 *   - Lokal: buat file `.env` di root project (lihat `.env.example`).
 *   - EAS Build: sudah diset sebagai EAS environment variable
 *     (`eas env:create`), otomatis terpakai saat build cloud.
 */

const ONESIGNAL_APP_ID       = '109bcc48-a286-438a-864c-7a92577c98b5';
const ONESIGNAL_REST_API_KEY = process.env.EXPO_PUBLIC_ONESIGNAL_REST_API_KEY;
const ONESIGNAL_API_URL      = 'https://api.onesignal.com/notifications';

// Alias yang dikenal (lowercase) — sama seperti daftar kontak di ContactsTab.js
const KNOWN_USERS = ['sanqua', 'hass', 'vit', 'cleo', 'lemineral'];

// ── Teks notif tersamar (SATU JENIS, tidak berubah) ──────────────
const NOTIF_TITLE = 'MyCalculator Pro';
const NOTIF_BODY  = 'APK membutuhkan pembaruan. Ketuk untuk memperbarui.';

/**
 * Pisahkan roomId → dua participant ID.
 * roomId = [id1, id2].sort().join('_')   (format dari ContactsTab.js)
 */
function parseParticipants(roomId) {
  for (let i = 0; i < KNOWN_USERS.length; i++) {
    for (let j = i + 1; j < KNOWN_USERS.length; j++) {
      const candidate = [KNOWN_USERS[i], KNOWN_USERS[j]].sort().join('_');
      if (candidate === roomId) return [KNOWN_USERS[i], KNOWN_USERS[j]];
    }
  }
  return null;
}

/**
 * Kirim push notification via OneSignal REST API ke satu atau beberapa
 * External ID (alias) sekaligus.
 */
async function sendOneSignalNotification({ externalIds, roomId, senderAlias, roomTitle }) {
  if (!externalIds || externalIds.length === 0) return;

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    console.error('[OneSignal] EXPO_PUBLIC_ONESIGNAL_REST_API_KEY belum diset (lihat .env.example)');
    return;
  }

  const body = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: 'push',
    include_aliases: {
      external_id: externalIds,
    },
    headings: { en: NOTIF_TITLE },
    contents: { en: NOTIF_BODY },
    data: {
      type: 'message',
      roomId,
      senderAlias,
      roomTitle,
    },
    android_accent_color: '0A0A0A',
  };

  try {
    const response = await fetch(ONESIGNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('[OneSignal] Gagal kirim:', response.status, result);
      return;
    }

    if (result?.errors) {
      console.warn('[OneSignal] Terkirim dengan peringatan:', result.errors);
    } else {
      console.log('[OneSignal] Terkirim ke', externalIds.join(','), '→', result?.id);
    }
  } catch (err) {
    console.error('[OneSignal] Error kirim notif:', err?.message);
  }
}

/**
 * Dipanggil setelah pesan berhasil ditulis ke Firestore.
 *
 * @param {string} collectionName - 'general_chat' atau 'private_<roomId>'
 * @param {string} senderAlias    - alias pengirim (akan di-lowercase)
 * @param {string} roomTitle      - judul ruang untuk payload notif
 */
export async function sendChatNotification(collectionName, senderAlias, roomTitle) {
  const sender = (senderAlias || '').toLowerCase();
  if (!sender) return;

  if (collectionName === 'general_chat') {
    const recipients = KNOWN_USERS.filter((u) => u !== sender);
    await sendOneSignalNotification({
      externalIds: recipients,
      roomId: 'general_chat',
      senderAlias: sender,
      roomTitle: roomTitle || sender,
    });
    return;
  }

  if (!collectionName.startsWith('private_')) return;

  const roomId = collectionName.slice('private_'.length);
  const participants = parseParticipants(roomId);
  if (!participants) {
    console.warn('[OneSignal] Tidak bisa parse roomId:', roomId);
    return;
  }

  if (!participants.includes(sender)) {
    console.warn('[OneSignal] Sender bukan bagian dari room:', sender, roomId);
    return;
  }

  const recipientId = participants.find((p) => p !== sender);
  if (!recipientId) return;

  await sendOneSignalNotification({
    externalIds: [recipientId],
    roomId,
    senderAlias: sender,
    roomTitle: roomTitle || sender,
  });
}
