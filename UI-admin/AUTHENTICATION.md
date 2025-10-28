# Authentication System

Hệ thống authentication được thiết kế theo chuẩn senior developer với các tính năng sau:

## 🏗️ Kiến trúc

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
- **Quản lý state toàn cục** cho authentication
- **Auto token refresh** mỗi 14 phút
- **Persistent storage** với localStorage
- **Type-safe** với TypeScript interfaces

### 2. AuthService (`src/services/authService.ts`)
- **API client** với error handling
- **Token management** (access + refresh tokens)
- **Request interceptor** tự động thêm Authorization header
- **Comprehensive auth methods** (login, register, logout, refresh, etc.)

### 3. ProtectedRoute (`src/components/auth/ProtectedRoute.tsx`)
- **Route protection** với role-based access control
- **Loading states** và error handling
- **PublicRoute** cho login/register pages
- **Hierarchical role system** (admin > manager > staff)

## 🔐 Tính năng bảo mật

### Token Management
- **JWT tokens** với expiration handling
- **Refresh token** mechanism
- **Auto-logout** khi token hết hạn
- **Secure storage** trong localStorage

### Role-Based Access Control
```typescript
// Role hierarchy
admin: 3    // Full access
manager: 2  // Limited access  
staff: 1    // Basic access
```

### Route Protection
```typescript
// Protected routes require authentication
<ProtectedRoute requiredRole="admin">
  <AdminComponent />
</ProtectedRoute>

// Public routes redirect authenticated users
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

## 🎯 Sử dụng

### 1. Wrap App với AuthProvider
```typescript
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </AuthProvider>
  );
}
```

### 2. Sử dụng authentication trong components
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use auth state and methods
}
```

### 3. Role-based rendering
```typescript
import { useAuthGuard } from '../hooks/useAuthGuard';

function AdminPanel() {
  const { isAdmin, hasRole } = useAuthGuard();
  
  if (!isAdmin()) {
    return <AccessDenied />;
  }
  
  return <AdminContent />;
}
```

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Dorm Booking Admin
```

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

## 🚀 Advanced Features

### Auto Token Refresh
- Tự động refresh token trước khi hết hạn
- Fallback logout nếu refresh thất bại
- Background refresh không ảnh hưởng UX

### Error Handling
- **Network errors** với retry mechanism
- **Token expiration** với auto-refresh
- **Role permission** với access denied UI
- **Form validation** với real-time feedback

### Loading States
- **Global loading** cho auth operations
- **Component-level loading** cho forms
- **Skeleton screens** cho better UX

## 📱 UI Components

### Auth Pages
- **LoginPage** - Modern login form với validation
- **RegisterPage** - Registration với terms agreement
- **LoadingSpinner** - Reusable loading components

### Layout Integration
- **User info** trong sidebar và topbar
- **Logout functionality** với confirmation
- **Role display** với color coding

## 🔒 Security Best Practices

1. **HTTPS only** trong production
2. **Secure token storage** với httpOnly cookies (recommended)
3. **CSRF protection** với token validation
4. **Rate limiting** cho auth endpoints
5. **Input validation** và sanitization
6. **Error message** không leak sensitive info

## 🧪 Testing

```typescript
// Mock auth context for testing
const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  // ... other methods
};
```

## 📈 Performance

- **Lazy loading** cho auth components
- **Memoization** cho expensive operations
- **Optimistic updates** cho better UX
- **Bundle splitting** cho auth modules

---

Hệ thống này được thiết kế để scale và maintain dễ dàng, với separation of concerns rõ ràng và type safety hoàn toàn.
