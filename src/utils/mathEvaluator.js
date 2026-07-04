export const evaluate = (expression) => {
  try {
    // Keamanan Lapis 1: Hapus semua karakter kecuali angka dan operator matematika dasar
    const sanitized = expression.replace(/[^0-9+\-*/.]/g, '');
    if (!sanitized) return '0';

    // Evaluasi string matematika secara aman menggunakan Function
    // (lebih aman dari eval murni karena sudah disanitasi regex di atas)
    const result = new Function('return ' + sanitized)();

    // Validasi hasil agar tidak crash jika terjadi pembagian dengan nol atau angka tidak valid
    if (!isFinite(result) || isNaN(result)) return 'Error';

    // Format hasil untuk menghindari desimal tak terhingga
    return parseFloat(result.toFixed(8)).toString();
  } catch (error) {
    return 'Error';
  }
};
