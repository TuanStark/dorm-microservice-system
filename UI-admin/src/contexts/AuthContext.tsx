import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userData = localStorage.getItem('user_data');

        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Auto refresh token before expiry
  useEffect(() => {
    if (!authState.token) return;

    const refreshInterval = setInterval(async () => {
      try {
        await refreshAuthToken();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        logout();
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(refreshInterval);
  }, [authState.token]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login(credentials);
      const { user, token, refreshToken } = response;

      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_data', JSON.stringify(user));

      setAuthState({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.register(data);
      const { user, token, refreshToken } = response;

      // Store in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_data', JSON.stringify(user));

      setAuthState({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');

    // Reset state
    setAuthState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Call logout API (fire and forget)
    authService.logout().catch(console.error);
  };

  const refreshAuthToken = async () => {
    if (!authState.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refreshToken(authState.refreshToken);
      const { token, refreshToken } = response;

      // Update localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);

      setAuthState(prev => ({
        ...prev,
        token,
        refreshToken,
      }));
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshAuthToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
