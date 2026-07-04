import { useState } from 'react';
import { evaluate } from '../utils/mathEvaluator';

export const useCalculator = () => {
  // State 1: Untuk layar kalkulator biasa (Decoy)
  const [display, setDisplay] = useState('0');
  // State 2: Untuk membaca kode rahasia di latar belakang (Secret)
  const [sequence, setSequence] = useState('');

  const STEALTH_CODES = {
    '28+=': 'SanQua',
    '48+=': 'Hass',
    '15+=': 'Vit',
    '55+=': 'Cleo',
    '88+=': 'LeMinerale'
  };

  const handleKeyPress = (key) => {
    // REKAMAN RAHASIA DIMULAI
    const newSequence = sequence + key;
    setSequence(newSequence);

    // Cek apakah kode yang ditekan cocok dengan blueprint SSOT
    if (STEALTH_CODES[newSequence]) {
      const alias = STEALTH_CODES[newSequence];
      console.log(`[STEALTH] Kode Benar! Membuka gerbang untuk: ${alias}`);
      // TODO: Pemicu Cloud Function Verifikasi Token akan dipasang di sini
      setSequence(''); // Bersihkan jejak
      return;
    }

    // Proteksi Memori: Hapus sequence jika sudah kepanjangan & salah
    if (newSequence.length > 8) {
      setSequence(key);
    }

    // LOGIKA DECOY (Tampilan Kalkulator Normal)
    if (key === 'C') {
      setDisplay('0');
      setSequence('');
    } else if (key === '=') {
      // Menggunakan mathEvaluator aman tanpa eval()
      const result = evaluate(display);
      setDisplay(String(result));
    } else {
      setDisplay(display === '0' ? key : display + key);
    }
  };

  return { display, handleKeyPress };
};
