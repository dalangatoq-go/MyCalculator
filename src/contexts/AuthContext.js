import React, { createContext, useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
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
   * Keluar dari Skychat — hanya reset gerbang UI di memory (kembali ke
   * kalkulator, user harus masukkan kode lagi untuk masuk).
   *
   * SENGAJA TIDAK memanggil auth().signOut(): itu akan menghapus kredensial
   * anonymous Firebase yang tersimpan native di perangkat, sehingga sesi
   * berikutnya dapat UID anonymous yang BERBEDA. Karena aturan hapus pesan
   * di Firestore memverifikasi kepemilikan lewat senderUid === auth.uid,
   * UID yang berubah-ubah membuat pesan lama jadi tidak bisa dihapus lagi
   * ("Hapus untuk Semua" gagal & pesan kembali ke semula). UID anonymous
   * dibiarkan stabil per instalasi; yang benar-benar di-reset di sini hanya
   * status login UI (kode akses tidak pernah disimpan di storage apa pun).
   */
  const signOut = async () => {
    setIsUIAuthenticated(false);
    setUserAlias(null);
  };

  // ── Kunci ulang otomatis ke kalkulator saat app pindah ke
  // background/inactive (minimize, pindah app lain, tekan home) selagi
  // sesi Skychat sedang terbuka. Proses tetap hidup di RAM, hanya gerbang
  // UI yang direset — supaya dashboard chat tidak ketahuan kalau HP
  // dipegang orang lain saat app baru diminimize (belum sampai di-kill).
  const isUIAuthenticatedRef = useRef(isUIAuthenticated);
  isUIAuthenticatedRef.current = isUIAuthenticated;

  useEffect(() => {
    const prevStateRef = { current: AppState.currentState };

    const subscription = AppState.addEventListener('change', (nextState) => {
      const prevState = prevStateRef.current;
      if (
        prevState === 'active' &&
        nextState.match(/inactive|background/) &&
        isUIAuthenticatedRef.current
      ) {
        setIsUIAuthenticated(false);
        setUserAlias(null);
      }
      prevStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, []);

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
