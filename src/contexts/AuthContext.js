import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAlias, setUserAlias] = useState(null);

  const signInWithAlias = async (alias) => {
    try {
      await auth().signInAnonymously();
      setUserAlias(alias);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[AuthContext] signInAnonymously gagal:', error);
      throw error; // lempar ulang agar caller bisa handle
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      setIsAuthenticated(false);
      setUserAlias(null);
    } catch (error) {
      console.error('[AuthContext] signOut gagal:', error);
      // Tetap reset state lokal walau Firebase gagal
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
