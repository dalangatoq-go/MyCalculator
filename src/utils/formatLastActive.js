// Firestore presence tidak punya "onDisconnect" (itu fitur Realtime
// Database, bukan Firestore) — jika app ditutup paksa/koneksi putus
// tanpa sempat menulis status offline, dokumen bisa "online: true" basi.
// Untuk itu status online efektif juga disyaratkan lastActive masih
// baru (di bawah ambang ini), bukan cuma percaya field `online` mentah.
export const PRESENCE_STALE_MS = 60000; // 60 detik (> interval heartbeat 25 detik)

export function isPresenceOnline(presence) {
  if (!presence?.online || !presence?.lastActive) return false;
  const ts = presence.lastActive.toMillis
    ? presence.lastActive.toMillis()
    : new Date(presence.lastActive).getTime();
  return Date.now() - ts < PRESENCE_STALE_MS;
}

export function formatLastActive(ts) {
  if (!ts) return 'Belum pernah aktif';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Baru saja aktif';
    if (diffMin < 60) return `Aktif ${diffMin} menit lalu`;
    if (diffHour < 24) return `Aktif ${diffHour} jam lalu`;
    if (diffDays === 1) return 'Aktif kemarin';
    if (diffDays < 7) return `Aktif ${diffDays} hari lalu`;
    return `Terakhir aktif ${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`;
  } catch {
    return 'Belum pernah aktif';
  }
}
