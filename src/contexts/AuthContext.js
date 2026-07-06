import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { registerFCMToken, unregisterFCMToken } from '../utils/notifications';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAlias, setUserAlias] = useState(null);

  const signInWithAlias = async (alias) => {
    try {
      await auth().signInAnonymously();
      setUserAlias(alias);
      setIsAuthenticated(true);

      // Daftarkan FCM token setelah login berhasil
      await registerFCMToken(alias);
    } catch (error) {
      console.error('[AuthContext] signInAnonymously gagal:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Hapus FCM token dari Firestore sebelum logout
      if (userAlias) {
        await unregisterFCMToken(userAlias);
      }
      await auth().signOut();
    } catch (error) {
      console.error('[AuthContext] signOut gagal:', error);
    } finally {
      setIsAuthenticated(false);
      setUserAlias(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userAlias, signInWithAlias, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
