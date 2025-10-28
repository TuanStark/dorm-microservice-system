import { User, LoginCredentials, RegisterData } from '../contexts/AuthContext';
import { mockAuthService } from './mockAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || !API_BASE_URL;

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/auth`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  private async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('AuthService.login called with:', credentials);
    console.log('USE_MOCK_DATA:', USE_MOCK_DATA);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock auth service');
      return mockAuthService.login(credentials);
    }
    
    console.log('Using real API');
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      return mockAuthService.register(data);
    }
    
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockAuthService.logout();
    }
    
    try {
      await this.authenticatedRequest('/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Logout should not fail even if API call fails
      console.warn('Logout API call failed:', error);
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    if (USE_MOCK_DATA) {
      return mockAuthService.refreshToken(refreshToken);
    }
    
    return this.request<RefreshTokenResponse>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK_DATA) {
      return mockAuthService.getCurrentUser();
    }
    
    return this.authenticatedRequest<User>('/me');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    if (USE_MOCK_DATA) {
      return mockAuthService.updateProfile(userData);
    }
    
    return this.authenticatedRequest<User>('/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockAuthService.changePassword(data);
    }
    
    return this.authenticatedRequest<void>('/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockAuthService.forgotPassword(email);
    }
    
    return this.request<void>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockAuthService.resetPassword(data);
    }
    
    return this.request<void>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockAuthService.verifyEmail(token);
    }
    
    return this.request<void>('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockAuthService.resendVerificationEmail();
    }
    
    return this.authenticatedRequest<void>('/resend-verification', {
      method: 'POST',
    });
  }
}

export const authService = new AuthService();
