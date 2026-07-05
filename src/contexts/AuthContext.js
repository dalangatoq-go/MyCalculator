import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAlias, setUserAlias] = useState(null);

  const signInWithAlias = async (alias) => {
    await auth().signInAnonymously();
    setUserAlias(alias);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await auth().signOut();
    setIsAuthenticated(false);
    setUserAlias(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userAlias, signInWithAlias, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
