# 🚀 Quick Start - Mock Authentication

## Cách test authentication ngay lập tức:

### 1. Setup
```bash
# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

### 2. Test Credentials

Mở `http://localhost:5173/login` và sử dụng:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@dormitory.com` | `admin123` | Full access |
| **Manager** | `manager@dormitory.com` | `manager123` | Limited access |
| **Staff** | `staff@dormitory.com` | `staff123` | Basic access |

### 3. Test Features

✅ **Login/Logout** - Test authentication flow  
✅ **Role-based Access** - Different permissions per role  
✅ **Protected Routes** - Automatic redirects  
✅ **Token Management** - Auto refresh simulation  
✅ **Error Handling** - Invalid credentials  
✅ **Loading States** - Realistic delays  

### 4. Mock Data Info

- **Network delays**: 1-2 seconds (realistic)
- **Token expiry**: 15 minutes
- **Auto refresh**: Every 14 minutes
- **Error simulation**: Invalid credentials, network errors

### 5. Switch to Real API

Khi backend ready:
```env
# In .env file
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://your-backend-url
```

---

**Ready to test!** 🎉
