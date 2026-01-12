import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, loginWithGoogle, logout, forceMockLogin } from '../services/firebase';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  enterDemoMode: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login error", err);
      let message = "No se pudo conectar con Google.";
      if (err.code === 'auth/popup-blocked') message = "El navegador bloqueó la ventana de login.";
      if (err.code === 'auth/unauthorized-domain') message = "Dominio no autorizado en Firebase.";
      setError(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const enterDemoMode = () => {
    forceMockLogin();
  };

  const isAdmin = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticating, 
      error, 
      signIn, 
      signOut: logout, 
      enterDemoMode,
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};