import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { registerFCMToken } from '../utils/notifications';

export const AuthContext = createContext();

/**
 * Sesi login hidup HANYA di memory (state React), tidak pernah ditulis ke
 * AsyncStorage/SecureStorage/storage apa pun. Setiap kali app dibuka dari
 * awal (proses baru), state ini kosong lagi → app SELALU tampil sebagai
 * kalkulator dan user harus memasukkan kode lagi. Tidak ada penguncian
 * alias per perangkat yang bertahan lintas sesi.
 */
export const AuthProvider = ({ children }) => {
  // ── isUIAuthenticated: apakah user sudah masuk Skychat di sesi (proses) ini
  const [isUIAuthenticated, setIsUIAuthenticated] = useState(false);

  // ── alias user untuk sesi berjalan ini saja
  const [userAlias, setUserAlias] = useState(null);

  // Tidak ada pemulihan sesi dari storage, jadi tidak ada state loading.
  const isLoadingSession = false;

  /**
   * Login dengan kode stealth.
   * Selalu melakukan signInAnonymously untuk sesi Firebase Auth baru di
   * memory (SDK Firebase sendiri yang mengelola token-nya secara native;
   * yang TIDAK disimpan aplikasi ini adalah kode akses / alias / flag login).
   */
  const signInWithAlias = async (alias) => {
    try {
      await auth().signInAnonymously();
      setUserAlias(alias);
      setIsUIAuthenticated(true);

      try {
        await registerFCMToken(alias);
      } catch (fcmErr) {
        console.warn('[AuthContext] registerFCMToken gagal:', fcmErr?.message);
      }
    } catch (err) {
      console.error('[AuthContext] signInAnonymously gagal:', err);
      throw err;
    }
  };

  /**
   * Keluar dari Skychat — hancurkan sesi sepenuhnya di memory.
   * Kembali ke kalkulator; user harus masukkan kode lagi untuk masuk.
   */
  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (err) {
      console.error('[AuthContext] signOut gagal:', err?.message);
    } finally {
      setIsUIAuthenticated(false);
      setUserAlias(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isUIAuthenticated,
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
