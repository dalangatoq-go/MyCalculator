import { useState, useContext } from 'react';
import { evaluate } from '../utils/mathEvaluator';
import { AuthContext } from '../contexts/AuthContext';

export const useCalculator = () => {
  const [display, setDisplay]   = useState('0');
  const [sequence, setSequence] = useState('');
  const { signInWithAlias }     = useContext(AuthContext);

  const STEALTH_CODES = {
    '28+=': 'SanQua',
    '48+=': 'Hass',
    '15+=': 'Vit',
    '55+=': 'Cleo',
    '88+=': 'LeMinerale',
  };

  const handleKeyPress = async (key) => {
    if (key === 'C') {
      setDisplay('0');
      setSequence('');
      return;
    }

    const newSequence = sequence + key;

    if (STEALTH_CODES[newSequence]) {
      const alias = STEALTH_CODES[newSequence];
      setSequence('');
      setDisplay('0');
      try {
        await signInWithAlias(alias);
      } catch (err) {
        // ALIAS_LOCKED atau error lain → reset diam-diam tanpa pesan error
        // Kalkulator terlihat normal, kode seolah tidak terjadi apa-apa
        setDisplay('0');
        setSequence('');
      }
      return;
    }

    const safeSequence = newSequence.length > 8 ? key : newSequence;
    setSequence(safeSequence);

    if (key === '=') {
      const result = evaluate(display);
      setDisplay(String(result));
      setSequence('');
    } else {
      setDisplay(display === '0' ? key : display + key);
    }
  };

  return { display, handleKeyPress };
};
