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
