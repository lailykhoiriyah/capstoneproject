'use client';

import { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext({
  isLoggedIn: false,
  currentUser: null,
  login: () => {},
  logout: () => {},
  status: 'unauthenticated'
});

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  const login = () => {
    signIn('google');
  };

  const logout = () => {
    signOut();
  };

  const value = {
    isLoggedIn: !!session,
    currentUser: session?.user || null,
    login,
    logout,
    status
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
