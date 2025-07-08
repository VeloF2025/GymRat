'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/lib/store';
import { 
  createMockUser, 
  mockSignIn, 
  mockSignUp, 
  mockSignOut, 
  mockSignInWithGoogle, 
  mockResetPassword 
} from '@/lib/mockAuth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  useMockAuth: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockAuth, setUseMockAuth] = useState(false);
  const { setUser } = useUserStore();

  useEffect(() => {
    let unsubscribe: () => void;
    
    try {
      // Check if we're in development mode
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setUser(user);
        setLoading(false);
      }, (error) => {
        // Handle auth state change errors
        console.error('Firebase auth state change error:', error);
        if (isDevelopment) {
          console.log('Using mock authentication for development');
          setUseMockAuth(true);
          
          // For development: create a mock user
          const mockUser = createMockUser();
          setCurrentUser(mockUser);
          setUser(mockUser);
          setLoading(false);
        } else {
          setError('Authentication error: ' + error.message);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Firebase auth initialization error:', err);
      
      // Only use mock auth in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock authentication for development');
        setError('Firebase authentication error. Using mock data for development.');
        setUseMockAuth(true);
        
        // For development: create a mock user
        const mockUser = createMockUser();
        setCurrentUser(mockUser);
        setUser(mockUser);
      } else {
        setError('Authentication service unavailable. Please try again later.');
      }
      
      setLoading(false);
      
      // Return empty function as unsubscribe
      unsubscribe = () => {};
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setUser]);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<User> => {
    if (useMockAuth) {
      const mockUser = await mockSignIn(email, password);
      // Update the user state with the mock user
      setCurrentUser(mockUser);
      setUser(mockUser);
      return mockUser;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      // In development mode, fall back to mock auth
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase sign in error in development mode, using mock auth:', error.message);
        setUseMockAuth(true);
        const mockUser = await mockSignIn(email, password);
        // Update the user state with the mock user
        setCurrentUser(mockUser);
        setUser(mockUser);
        return mockUser;
      } else {
        // In production, throw the error to be handled by the calling component
        throw error;
      }
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string): Promise<User> => {
    if (useMockAuth) {
      return await mockSignUp(email, password);
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      // In development mode, fall back to mock auth
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase sign up error in development mode, using mock auth:', error.message);
        setUseMockAuth(true);
        return await mockSignUp(email, password);
      } else {
        // In production, throw the error to be handled by the calling component
        throw error;
      }
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    if (useMockAuth) {
      await mockSignOut();
      setCurrentUser(null);
      setUser(null);
      return;
    }
    
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      // In development mode, fall back to mock auth
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase sign out error in development mode, using mock auth:', error.message);
        setUseMockAuth(true);
        await mockSignOut();
        setCurrentUser(null);
        setUser(null);
      } else {
        // In production, throw the error to be handled by the calling component
        throw error;
      }
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<User> => {
    if (useMockAuth) {
      const mockUser = await mockSignInWithGoogle();
      // Ensure we update the user state
      setCurrentUser(mockUser);
      setUser(mockUser);
      return mockUser;
    }
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      // Firebase auth state change should handle this, but let's be explicit
      setCurrentUser(userCredential.user);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      // In development mode, fall back to mock auth
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Google sign in error in development mode, using mock auth:', error.message);
        setUseMockAuth(true);
        const mockUser = await mockSignInWithGoogle();
        // Ensure we update the user state
        setCurrentUser(mockUser);
        setUser(mockUser);
        return mockUser;
      } else {
        // In production, throw the error to be handled by the calling component
        throw error;
      }
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    if (useMockAuth) {
      return await mockResetPassword(email);
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      // In development mode, fall back to mock auth
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase password reset error in development mode, using mock auth:', error.message);
        setUseMockAuth(true);
        return await mockResetPassword(email);
      } else {
        // In production, throw the error to be handled by the calling component
        throw error;
      }
    }
  };

  const value = {
    currentUser,
    loading,
    useMockAuth,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
