/**
 * Firebase Cloud Functions — MyCalculator-Pro
 *
 * Trigger : dokumen baru di koleksi "private_*" (chat privat).
 * Notifikasi : SELALU terlihat seperti notif update APK (tersamar).
 *              Satu jenis, satu tampilan — tidak ada variasi teks.
 *
 * Data payload (tersembunyi, tidak tampil di layar) dipakai app
 * untuk navigasi ke chat yang tepat saat notif di-tap.
 */

const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// Alias yang dikenal (lowercase)
const KNOWN_USERS = ['sanqua', 'hass', 'vit', 'cleo', 'lemineral'];

// ── Teks notif tersamar (SATU JENIS, tidak berubah) ──────────────
const NOTIF_TITLE   = 'MyCalculator Pro';
const NOTIF_BODY    = 'APK membutuhkan pembaruan. Ketuk untuk memperbarui.';

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

exports.onPrivateMessageCreated = functions.firestore
  .document('{collectionId}/{messageId}')
  .onCreate(async (snap, context) => {
    const { collectionId } = context.params;

    // Hanya proses koleksi chat privat
    if (!collectionId.startsWith('private_')) return null;

    const roomId      = collectionId.slice('private_'.length);
    const data        = snap.data();
    const senderAlias = (data?.userAlias || '').toLowerCase();

    if (!senderAlias) return null;

    // Tentukan penerima
    const participants = parseParticipants(roomId);
    if (!participants) {
      functions.logger.warn('[FCM] Tidak bisa parse roomId:', roomId);
      return null;
    }

    const recipientId = participants.find(p => p !== senderAlias);
    if (!recipientId) return null;

    // Ambil FCM token penerima
    const tokenDoc = await db.collection('fcm_tokens').doc(recipientId).get();
    if (!tokenDoc.exists) {
      functions.logger.info('[FCM] Token tidak ada untuk:', recipientId);
      return null;
    }

    const { token } = tokenDoc.data();
    if (!token) return null;

    // ── Kirim notifikasi tersamar ─────────────────────────────────
    const message = {
      // Yang tampil di lockscreen / notification drawer
      notification: {
        title: NOTIF_TITLE,
        body:  NOTIF_BODY,
      },

      // Data tersembunyi — untuk navigasi saat notif di-tap
      data: {
        type:        'message',
        roomId:      roomId,
        senderAlias: data.userAlias || senderAlias,
        roomTitle:   data.userAlias || senderAlias,
      },

      android: {
        priority: 'high',
        notification: {
          channelId: 'updates',
          sound:     'default',
          icon:      'ic_launcher',
          color:     '#0A0A0A',
        },
      },

      token,
    };

    try {
      const response = await admin.messaging().send(message);
      functions.logger.info('[FCM] Terkirim ke', recipientId, '→', response);
    } catch (err) {
      functions.logger.error('[FCM] Gagal kirim:', err);
    }

    return null;
  });
