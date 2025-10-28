import { User, LoginCredentials, RegisterData } from '../contexts/AuthContext';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@dormitory.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'manager@dormitory.com',
    name: 'Manager User',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'staff@dormitory.com',
    name: 'Staff User',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock tokens storage
let mockTokens: { [key: string]: { token: string; refreshToken: string } } = {};

// Generate mock JWT token
const generateMockToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Generate mock refresh token
const generateMockRefreshToken = (): string => {
  return btoa(JSON.stringify({
    token: Math.random().toString(36).substring(2),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  }));
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockAuthService {
  async login(credentials: LoginCredentials) {
      console.log('MockAuthService.login called with:', credentials);
    await delay(1000); // Simulate network delay

    // Find user by email
    const user = mockUsers.find(u => u.email === credentials.email);
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found, throwing error');
      throw new Error('Invalid email or password');
    }

    // Simple password check (in real app, this would be hashed)
    const validPasswords = {
      'admin@dormitory.com': 'admin123',
      'manager@dormitory.com': 'manager123',
      'staff@dormitory.com': 'staff123',
    };

    console.log('Checking password for:', user.email);
    console.log('Expected password:', validPasswords[user.email as keyof typeof validPasswords]);
    console.log('Provided password:', credentials.password);

    if (validPasswords[user.email as keyof typeof validPasswords] !== credentials.password) {
      console.log('Password mismatch, throwing error');
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const token = generateMockToken(user);
    const refreshToken = generateMockRefreshToken();

    // Store tokens
    mockTokens[user.id] = { token, refreshToken };

    console.log('Login successful, returning:', { user, token: token.substring(0, 20) + '...', refreshToken: refreshToken.substring(0, 20) + '...' });

    return {
      user,
      token,
      refreshToken,
    };
  }

  async register(data: RegisterData) {
    await delay(1500); // Simulate network delay

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Validate password confirmation
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: data.email,
      name: data.name,
      role: 'staff', // Default role for new users
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    // Generate tokens
    const token = generateMockToken(newUser);
    const refreshToken = generateMockRefreshToken();

    // Store tokens
    mockTokens[newUser.id] = { token, refreshToken };

    return {
      user: newUser,
      token,
      refreshToken,
    };
  }

  async logout() {
    await delay(500);
    // In real app, this would invalidate tokens on server
    console.log('User logged out');
  }

  async refreshToken(refreshToken: string) {
    await delay(800);

    // Find user by refresh token
    const userId = Object.keys(mockTokens).find(
      id => mockTokens[id].refreshToken === refreshToken
    );

    if (!userId) {
      throw new Error('Invalid refresh token');
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const newToken = generateMockToken(user);
    const newRefreshToken = generateMockRefreshToken();

    // Update stored tokens
    mockTokens[userId] = { token: newToken, refreshToken: newRefreshToken };

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUser() {
    await delay(500);
    // This would normally use the token to get user info
    // For mock, return the first user
    return mockUsers[0];
  }

  async updateProfile(userData: Partial<User>) {
    await delay(1000);
    
    // Find and update user
    const userIndex = mockUsers.findIndex(u => u.id === userData.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    await delay(1000);
    
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (data.newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Mock success
    console.log('Password changed successfully');
  }

  async forgotPassword(email: string) {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }

    console.log(`Password reset email sent to ${email}`);
  }

  async resetPassword(data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) {
    await delay(1000);
    
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    console.log('Password reset successfully');
  }

  async verifyEmail(token: string) {
    await delay(1000);
    console.log('Email verified successfully');
  }

  async resendVerificationEmail() {
    await delay(1000);
    console.log('Verification email sent');
  }
}

export const mockAuthService = new MockAuthService();
