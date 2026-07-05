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
    '88+=': 'LeMinerale'
  };

  const handleKeyPress = (key) => {
    const newSequence = sequence + key;
    setSequence(newSequence);

    // Cek kode rahasia
    if (STEALTH_CODES[newSequence]) {
      const alias = STEALTH_CODES[newSequence];
      setSequence('');   // Hapus jejak
      setDisplay('0');   // Reset layar kalkulator
      signInWithAlias(alias); // Buka gerbang → pindah ke ChatRoom via AuthContext
      return;
    }

    // Proteksi memori
    if (newSequence.length > 8) {
      setSequence(key);
    }

    // Logika kalkulator decoy
    if (key === 'C') {
      setDisplay('0');
      setSequence('');
    } else if (key === '=') {
      const result = evaluate(display);
      setDisplay(String(result));
    } else {
      setDisplay(display === '0' ? key : display + key);
    }
  };

  return { display, handleKeyPress };
};
