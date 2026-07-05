import { useState, useContext } from 'react';
import { evaluate } from '../utils/mathEvaluator';
import { AuthContext } from '../contexts/AuthContext';

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [sequence, setSequence] = useState('');
  const { signInWithAlias } = useContext(AuthContext);

  const STEALTH_CODES = {
    '28+=': 'SanQua',
    '48+=': 'Hass',
    '15+=': 'Vit',
    '55+=': 'Cleo',
    '88+=': 'LeMinerale',
  };

  const handleKeyPress = (key) => {
    // Tombol C selalu reset tampilan dan sequence — cek paling awal
    if (key === 'C') {
      setDisplay('0');
      setSequence('');
      return;
    }

    const newSequence = sequence + key;

    // Cek kode rahasia
    if (STEALTH_CODES[newSequence]) {
      const alias = STEALTH_CODES[newSequence];
      setSequence('');   // Hapus jejak
      setDisplay('0');   // Reset layar kalkulator
      signInWithAlias(alias);
      return;
    }

    // Proteksi memori — jika sequence terlalu panjang, mulai ulang dari key ini
    const safeSequence = newSequence.length > 8 ? key : newSequence;
    setSequence(safeSequence);

    // Logika kalkulator
    if (key === '=') {
      const result = evaluate(display);
      setDisplay(String(result));
      setSequence(''); // Reset sequence setelah =
    } else {
      setDisplay(display === '0' ? key : display + key);
    }
  };

  return { display, handleKeyPress };
};
