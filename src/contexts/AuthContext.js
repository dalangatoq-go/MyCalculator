import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { registerFCMToken, unregisterFCMToken } from '../utils/notifications';

export const AuthContext = createContext();

// Kunci penyimpanan sesi di perangkat
const SESSION_KEY = '@mc_session';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAlias, setUserAlias]             = useState(null);
  // true selama pengecekan sesi awal — cegah layar kalkulator muncul sesaat
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // ── Pulihkan sesi tersimpan saat app dibuka ───────────────────
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(SESSION_KEY);
        if (json) {
          const { alias } = JSON.parse(json);
          await auth().signInAnonymously();
          setUserAlias(alias);
          setIsAuthenticated(true);
          // Perbarui FCM token (bisa berubah setelah reinstall)
          await registerFCMToken(alias);
        }
      } catch (err) {
        console.error('[AuthContext] restore session gagal:', err?.message);
      } finally {
        setIsLoadingSession(false);
      }
    })();
  }, []);

  /**
   * Login dengan kode stealth.
   * Jika perangkat sudah dikunci ke alias lain → lempar 'ALIAS_LOCKED'.
   */
  const signInWithAlias = async (alias) => {
    // Cek kunci alias perangkat
    const json = await AsyncStorage.getItem(SESSION_KEY);
    if (json) {
      const { alias: savedAlias } = JSON.parse(json);
      if (savedAlias.toLowerCase() !== alias.toLowerCase()) {
        // Tolak diam-diam — jangan beri tahu user alasannya
        throw new Error('ALIAS_LOCKED');
      }
    }

    try {
      await auth().signInAnonymously();
      setUserAlias(alias);
      setIsAuthenticated(true);

      // Simpan sesi & kunci alias ke perangkat ini
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ alias }));
      await registerFCMToken(alias);
    } catch (err) {
      if (err.message === 'ALIAS_LOCKED') throw err;
      console.error('[AuthContext] signInAnonymously gagal:', err);
      throw err;
    }
  };

  /**
   * Logout — kunci alias TETAP tersimpan.
   * Perangkat ini hanya bisa login kembali dengan alias yang sama.
   */
  const signOut = async () => {
    try {
      if (userAlias) await unregisterFCMToken(userAlias);
      await auth().signOut();
    } catch (err) {
      console.error('[AuthContext] signOut gagal:', err?.message);
    } finally {
      setIsAuthenticated(false);
      setUserAlias(null);
      // Catatan: SESSION_KEY TIDAK dihapus → alias tetap terkunci ke perangkat
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userAlias, isLoadingSession, signInWithAlias, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
