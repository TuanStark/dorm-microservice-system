# 🔧 Fix Mock Authentication

## Vấn đề: Mock data không hoạt động

### Nguyên nhân có thể:
1. **Chưa có file .env** với `VITE_USE_MOCK_DATA=true`
2. **Environment variables** không được load đúng
3. **Development server** cần restart

## 🚀 Cách sửa:

### Bước 1: Tạo file .env
Tạo file `.env` trong thư mục `UI-admin` với nội dung:
```env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3000
```

### Bước 2: Restart development server
```bash
# Stop server (Ctrl+C)
# Rồi chạy lại:
npm run dev
```

### Bước 3: Kiểm tra Debug Info
- Mở `http://localhost:5173/login`
- Xem phần "Debug Information" 
- Đảm bảo `VITE_USE_MOCK_DATA` = `true`

### Bước 4: Test với mock credentials
Sử dụng:
- **Email**: `admin@dormitory.com`
- **Password**: `admin123`

## 🔍 Debug Steps:

1. **Mở Browser Console** (F12)
2. **Thử login** với mock credentials
3. **Xem console logs**:
   - `AuthService.login called with:`
   - `USE_MOCK_DATA: true`
   - `Using mock auth service`
   - `MockAuthService.login called with:`

## 📋 Test Credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@dormitory.com` | `admin123` |
| Manager | `manager@dormitory.com` | `manager123` |
| Staff | `staff@dormitory.com` | `staff123` |

## ⚠️ Troubleshooting:

### Nếu vẫn không work:
1. **Clear browser cache**
2. **Hard refresh** (Ctrl+Shift+R)
3. **Check console errors**
4. **Verify .env file** exists và có đúng content

### Nếu thấy "Using real API":
- File `.env` chưa được tạo hoặc sai format
- Server chưa được restart
- Environment variable không được load

---

**Sau khi fix, mock authentication sẽ hoạt động!** ✅
