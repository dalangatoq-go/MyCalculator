/**
 * Format timestamp ke jam:menit sesuai zona waktu perangkat user.
 *
 * Menggunakan Intl.DateTimeFormat (tanpa argumen timeZone) sehingga
 * output SELALU mengikuti zona waktu lokal perangkat — bukan UTC.
 * Lebih andal dari toLocaleTimeString([]) di beberapa versi Hermes/Android.
 */
export const formatTime = (date) => {
  try {
    if (date == null) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, {
      hour:   '2-digit',
      minute: '2-digit',
      hour12: false,       // format 24 jam (13:05, bukan 1:05 PM)
    }).format(d);
  } catch {
    return '';
  }
};
