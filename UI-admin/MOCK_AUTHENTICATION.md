# Mock Authentication System

Hệ thống mock authentication cho phép bạn test authentication mà không cần backend.

## 🚀 Cách sử dụng

### 1. Enable Mock Data
Tạo file `.env` từ `env.example`:
```bash
cp env.example .env
```

Đảm bảo `VITE_USE_MOCK_DATA=true` trong file `.env`:
```env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Mock Users

Hệ thống có sẵn 3 mock users với các role khác nhau:

#### Admin User
- **Email**: `admin@dormitory.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Access**: Full access to all features

#### Manager User
- **Email**: `manager@dormitory.com`
- **Password**: `manager123`
- **Role**: `manager`
- **Access**: Limited access to management features

#### Staff User
- **Email**: `staff@dormitory.com`
- **Password**: `staff123`
- **Role**: `staff`
- **Access**: Basic access to staff features

### 3. Testing Authentication

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Go to login page**: `http://localhost:5173/login`

3. **Use mock credentials**: Nhập email/password từ danh sách trên

4. **Test role-based access**: 
   - Login với admin → Full access
   - Login với manager → Limited access
   - Login với staff → Basic access

### 4. Mock Features

#### ✅ Implemented
- **Login/Logout** với validation
- **Registration** với password confirmation
- **Token management** (JWT simulation)
- **Role-based access control**
- **Auto token refresh** simulation
- **Error handling** với realistic delays
- **Loading states** cho better UX

#### 🔄 Simulated Behaviors
- **Network delays** (1-2 seconds)
- **Token expiration** (15 minutes)
- **Refresh token** mechanism
- **Error responses** cho invalid credentials

### 5. Switching to Real API

Khi backend sẵn sàng, chỉ cần:

1. **Set API URL** trong `.env`:
   ```env
   VITE_API_BASE_URL=http://your-backend-url
   ```

2. **Disable mock data**:
   ```env
   VITE_USE_MOCK_DATA=false
   ```

3. **Restart the app**:
   ```bash
   npm run dev
   ```

### 6. Mock Data Structure

#### User Object
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Auth Response
```typescript
interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
```

### 7. Development Tools

#### Mock Users Info Component
- Hiển thị trên login page trong development mode
- Copy credentials với một click
- Visual role indicators
- Usage instructions

#### Console Logging
- Mock service logs actions to console
- Useful for debugging authentication flow
- Check browser console for details

### 8. Customization

#### Adding New Mock Users
Edit `src/services/mockAuthService.ts`:

```typescript
const mockUsers: User[] = [
  // ... existing users
  {
    id: '4',
    email: 'newuser@example.com',
    name: 'New User',
    role: 'staff',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Add password mapping
const validPasswords = {
  // ... existing passwords
  'newuser@example.com': 'password123',
};
```

#### Modifying Delays
```typescript
// In mockAuthService.ts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Usage
await delay(1000); // 1 second delay
```

### 9. Testing Scenarios

#### Happy Path
1. Login với valid credentials
2. Access protected routes
3. Logout successfully

#### Error Cases
1. Invalid email/password
2. Token expiration
3. Role permission denied
4. Network errors

#### Edge Cases
1. Empty form submission
2. Invalid email format
3. Password too short
4. Registration với existing email

### 10. Production Considerations

- **Remove mock data** trước khi deploy
- **Set proper API URLs** cho production
- **Configure CORS** trên backend
- **Use HTTPS** cho production
- **Implement proper error handling**

---

Mock system này giúp bạn develop và test authentication features một cách độc lập, không phụ thuộc vào backend availability.
