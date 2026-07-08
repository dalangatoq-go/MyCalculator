import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { registerFCMToken, unregisterFCMToken } from '../utils/notifications';

export const AuthContext = createContext();

// Kunci penyimpanan sesi di perangkat
const SESSION_KEY = '@mc_session';

export const AuthProvider = ({ children }) => {
  // ── isUIAuthenticated: apakah user sudah ketik kode stealth di sesi INI
  // Selalu mulai false → app SELALU buka sebagai kalkulator
  const [isUIAuthenticated, setIsUIAuthenticated] = useState(false);

  // ── isFirebaseReady: Firebase auth + FCM aktif di background
  // Dipulihkan diam-diam saat app dibuka (tidak mempengaruhi tampilan)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // ── alias user yang terkunci di perangkat ini
  const [userAlias, setUserAlias] = useState(null);

  // ── true hanya selama pemulihan sesi awal (cegah flash layar)
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // ── Pulihkan Firebase auth + FCM diam-diam saat app dibuka ───
  // isUIAuthenticated TETAP false → kalkulator tetap tampil
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(SESSION_KEY);
        if (json) {
          const { alias } = JSON.parse(json);

          // Pulihkan Firebase auth di background (untuk FCM)
          await auth().signInAnonymously();

          // Simpan alias di state (dibutuhkan saat notif masuk)
          setUserAlias(alias);
          setIsFirebaseReady(true);

          // Perbarui FCM token (bisa berubah setelah reinstall)
          await registerFCMToken(alias);

          // TIDAK set isUIAuthenticated → kalkulator tetap tampil
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
   * - Jika perangkat sudah dikunci ke alias lain → lempar 'ALIAS_LOCKED'.
   * - Jika Firebase sudah siap (sesi ada) → langsung buka UI tanpa signIn ulang.
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

      // Sesi sudah ada & alias cocok → Firebase sudah siap di background
      // Langsung buka UI tanpa signInAnonymously ulang
      setIsUIAuthenticated(true);
      return;
    }

    // Sesi belum ada → login pertama kali
    try {
      await auth().signInAnonymously();
      setUserAlias(alias);
      setIsFirebaseReady(true);
      setIsUIAuthenticated(true);

      // Simpan sesi & kunci alias ke perangkat ini
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ alias }));
      await registerFCMToken(alias);
    } catch (err) {
      console.error('[AuthContext] signInAnonymously gagal:', err);
      throw err;
    }
  };

  /**
   * Logout — hanya menutup UI (kembali ke kalkulator).
   * Firebase auth + FCM TETAP aktif di background agar notif tetap masuk.
   * Kunci alias TETAP tersimpan di perangkat.
   */
  const signOut = async () => {
    try {
      // TIDAK unregister FCM & TIDAK signOut Firebase
      // → notifikasi tetap bisa masuk meski UI kembali ke kalkulator
    } catch (err) {
      console.error('[AuthContext] signOut gagal:', err?.message);
    } finally {
      // Hanya tutup UI — alias & Firebase tetap aktif
      setIsUIAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isUIAuthenticated,   // ← dipakai AppNavigator untuk routing
        isFirebaseReady,     // ← status background Firebase (opsional dipakai)
        isLoadingSession,
        userAlias,
        signInWithAlias,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
