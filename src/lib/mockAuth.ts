// Mock authentication helpers for development mode
import { User } from 'firebase/auth';

// Demo account credentials
const DEMO_ACCOUNTS = {
  client: {
    email: 'demo@gymrat.com',
    password: 'demo123',
    displayName: 'Demo Client',
    role: 'client'
  },
  admin: {
    email: 'admin@gymrat.com',
    password: 'demo123',
    displayName: 'Demo Admin',
    role: 'admin'
  }
};

// Create a mock Firebase User object
export const createMockUser = (
  options: {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
    customClaims?: Record<string, any>;
  } = {}
): User => {
  const now = new Date().getTime();
  
  return {
    uid: options.uid || 'mock-user-123',
    email: options.email || 'user@example.com',
    emailVerified: options.emailVerified ?? true,
    displayName: options.displayName || 'Demo User',
    photoURL: options.photoURL || null,
    phoneNumber: null,
    isAnonymous: false,
    tenantId: null,
    providerData: [
      {
        providerId: 'password',
        uid: options.email || 'user@example.com',
        displayName: options.displayName || 'Demo User',
        email: options.email || 'user@example.com',
        phoneNumber: null,
        photoURL: options.photoURL || null,
      }
    ],
    metadata: {
      creationTime: now - 86400000, // 1 day ago
      lastSignInTime: now,
    },
    
    // Required methods
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve('mock-id-token'),
    getIdTokenResult: () => Promise.resolve({
      token: 'mock-id-token',
      authTime: new Date().toISOString(),
      issuedAtTime: new Date().toISOString(),
      expirationTime: new Date(now + 3600000).toISOString(),
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: options.customClaims || {},
    }),
    reload: () => Promise.resolve(),
    toJSON: () => ({}),
  } as unknown as User;
};

// Mock authentication functions
export const mockSignIn = async (email: string, password: string): Promise<User> => {
  // Check for demo accounts
  const clientAccount = DEMO_ACCOUNTS.client;
  const adminAccount = DEMO_ACCOUNTS.admin;
  
  if (email === clientAccount.email && password === clientAccount.password) {
    return createMockUser({
      email: clientAccount.email,
      displayName: clientAccount.displayName,
      customClaims: { role: clientAccount.role }
    });
  }
  
  if (email === adminAccount.email && password === adminAccount.password) {
    return createMockUser({
      email: adminAccount.email,
      displayName: adminAccount.displayName,
      customClaims: { role: adminAccount.role, isAdmin: true }
    });
  }
  
  // Regular validation
  if (password.length < 6) {
    throw new Error('Password should be at least 6 characters');
  }
  
  return createMockUser({ email });
};

export const mockSignUp = async (email: string, password: string): Promise<User> => {
  if (password.length < 6) {
    throw new Error('Password should be at least 6 characters');
  }
  
  return createMockUser({ email });
};

export const mockSignOut = async (): Promise<void> => {
  return Promise.resolve();
};

export const mockSignInWithGoogle = async (): Promise<User> => {
  return createMockUser({
    displayName: 'Google User',
    email: 'google-user@gmail.com',
    photoURL: 'https://lh3.googleusercontent.com/a/default-user',
  });
};

export const mockResetPassword = async (email: string): Promise<void> => {
  if (!email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  return Promise.resolve();
};
