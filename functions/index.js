/**
 * Firebase Cloud Functions — MyCalculator-Pro
 *
 * STATUS: TIDAK DIPAKAI SAAT INI. Project belum di paket Blaze (butuh
 * kartu pembayaran untuk mengaktifkan Cloud Build API), jadi function ini
 * tidak bisa di-deploy. Notifikasi chat untuk sementara dikirim langsung
 * dari client — lihat src/utils/pushNotify.js. Kalau nanti project sudah
 * bisa pindah ke Blaze, function ini bisa dideploy lagi dan panggilan
 * client-side di pushNotify.js/ChatRoomScreen.js dicabut supaya tidak
 * kirim notif dobel.
 *
 * Trigger : dokumen baru di koleksi "private_*" atau "general_chat" (chat).
 * Notifikasi : dikirim via OneSignal REST API ke External ID (alias)
 *              penerima, bukan lagi via Firebase Cloud Messaging langsung.
 *              Alias didaftarkan sebagai OneSignal External ID oleh client
 *              lewat `OneSignal.login(alias)` (lihat src/utils/oneSignalService.js).
 *
 * Notifikasi : SELALU terlihat seperti notif update APK (tersamar).
 *              Satu jenis, satu tampilan — tidak ada variasi teks.
 *
 * Data payload (tersembunyi, tidak tampil di layar) dipakai app
 * untuk navigasi ke chat yang tepat saat notif di-tap.
 *
 * Env vars dibutuhkan (functions/.env, TIDAK di-commit ke git):
 *   ONESIGNAL_APP_ID        — App ID OneSignal (bukan REST API Key)
 *   ONESIGNAL_REST_API_KEY  — REST API Key OneSignal (rahasia)
 */

const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

const ONESIGNAL_APP_ID       = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const ONESIGNAL_API_URL      = 'https://api.onesignal.com/notifications';

// Alias yang dikenal (lowercase)
const KNOWN_USERS = ['sanqua', 'hass', 'vit', 'cleo', 'lemineral'];

// ── Teks notif tersamar (SATU JENIS, tidak berubah) ──────────────
const NOTIF_TITLE = 'MyCalculator Pro';
const NOTIF_BODY  = 'APK membutuhkan pembaruan. Ketuk untuk memperbarui.';

/**
 * Pisahkan roomId → dua participant ID.
 * roomId = [id1, id2].sort().join('_')   (format dari ContactsTab.js)
 *
 * Algoritma: coba semua pasangan dari KNOWN_USERS, rekonstruksi roomId
 * dengan cara yang sama seperti client, lalu cocokkan.
 * Lebih sederhana dan bebas dari bug tumpang-tindih prefix/suffix.
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
 * Kirim push notification via OneSignal REST API ke satu External ID.
 * Menggunakan `fetch` global (tersedia di Node 18 runtime Cloud Functions).
 */
async function sendOneSignalNotification({ externalId, roomId, senderAlias, roomTitle }) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    functions.logger.error('[OneSignal] ONESIGNAL_APP_ID / ONESIGNAL_REST_API_KEY belum diset di functions/.env');
    return;
  }

  const body = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: 'push',
    include_aliases: {
      external_id: [externalId],
    },
    headings: { en: NOTIF_TITLE },
    contents: { en: NOTIF_BODY },
    data: {
      type: 'message',
      roomId,
      senderAlias,
      roomTitle,
    },
    android_channel_id: undefined, // opsional: isi jika sudah bikin channel khusus di OneSignal dashboard
    android_accent_color: '0A0A0A',
  };

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
    functions.logger.error('[OneSignal] Gagal kirim:', response.status, result);
    return;
  }

  if (result?.errors) {
    // OneSignal bisa balas 200 tapi tetap menyertakan `errors`
    // (mis. "All included players are not subscribed") — catat, jangan lempar.
    functions.logger.warn('[OneSignal] Terkirim dengan peringatan:', result.errors);
  } else {
    functions.logger.info('[OneSignal] Terkirim ke', externalId, '→', result?.id);
  }
}

exports.onPrivateMessageCreated = functions.firestore
  .document('{collectionId}/{messageId}')
  .onCreate(async (snap, context) => {
    const { collectionId } = context.params;

    const data        = snap.data();
    const senderAlias  = (data?.userAlias || '').toLowerCase();
    if (!senderAlias) return null;

    let recipientId;
    let roomId;

    if (collectionId === 'general_chat') {
      // Ruang publik: kirim ke semua alias yang dikenal kecuali pengirim.
      // OneSignal mendukung banyak external_id sekaligus dalam satu request.
      roomId = 'general_chat';
      const recipients = KNOWN_USERS.filter((u) => u !== senderAlias);
      if (recipients.length === 0) return null;

      await Promise.all(
        recipients.map((externalId) =>
          sendOneSignalNotification({
            externalId,
            roomId,
            senderAlias,
            roomTitle: data.userAlias || senderAlias,
          }).catch((err) => functions.logger.error('[OneSignal] Gagal kirim ke', externalId, err)),
        ),
      );
      return null;
    }

    if (!collectionId.startsWith('private_')) return null;

    roomId = collectionId.slice('private_'.length);

    const participants = parseParticipants(roomId);
    if (!participants) {
      functions.logger.warn('[OneSignal] Tidak bisa parse roomId:', roomId);
      return null;
    }

    if (!participants.includes(senderAlias)) {
      functions.logger.warn('[OneSignal] Sender bukan bagian dari room:', senderAlias, roomId);
      return null;
    }

    recipientId = participants.find((p) => p !== senderAlias);
    if (!recipientId) return null;

    try {
      await sendOneSignalNotification({
        externalId: recipientId,
        roomId,
        senderAlias,
        roomTitle: data.userAlias || senderAlias,
      });
    } catch (err) {
      functions.logger.error('[OneSignal] Gagal kirim:', err);
    }

    return null;
  });
