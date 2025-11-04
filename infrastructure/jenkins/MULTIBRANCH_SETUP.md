# 🚀 Hướng dẫn Setup Multibranch Pipeline (Khuyến nghị)

## Tại sao chọn Multibranch Pipeline?

✅ **Tự động detect** các service Jenkinsfiles  
✅ **Path filtering** đã có sẵn trong mỗi service  
✅ **Đơn giản** - không cần orchestration phức tạp  
✅ **Phù hợp** với monorepo  
✅ **Dễ maintain** và mở rộng  

## Setup nhanh (5 phút)

### Bước 1: Xóa hoặc ignore root Jenkinsfile

Root Jenkinsfile sẽ không được dùng với Multibranch Pipeline. Bạn có thể:
- Xóa file `Jenkinsfile` ở root, HOẶC
- Giữ lại nhưng Jenkins sẽ không dùng nó

### Bước 2: Tạo Multibranch Pipeline Job

1. **Jenkins Dashboard** → **New Item**
2. Nhập tên job: `dorm-microservice-system` (hoặc tên bạn muốn)
3. Chọn **Multibranch Pipeline** → **OK**

### Bước 3: Cấu hình Branch Sources

1. **Branch Sources** → **Add source** → **Git**
2. **Project Repository**: `https://github.com/TuanStark/dorm-microservice-system.git`
3. **Credentials**: Chọn `github-creds` (hoặc credentials của bạn)
4. **Behaviours** → **Add** → **Filter by name (with regular expression)**
   - Include: `main|develop|feature/.*` (hoặc pattern bạn muốn)

### Bước 4: Cấu hình Build Configuration

1. **Build Configuration** → **Mode**: **By Jenkinsfile**
2. **Script Path**: `services/**/Jenkinsfile`
   - Hoặc để Jenkins tự động detect (recommended)

### Bước 5: Scan để detect các services

1. Click **Scan Multibranch Pipeline Now**
2. Jenkins sẽ tự động:
   - Tìm tất cả Jenkinsfiles trong `services/*/Jenkinsfile`
   - Tạo branch/job cho mỗi service
   - Mỗi service sẽ có pipeline riêng

## Kết quả

Sau khi scan, bạn sẽ thấy:
- `dorm-microservice-system/api-gateway` → Build api-gateway
- `dorm-microservice-system/auth-service` → Build auth-service
- `dorm-microservice-system/booking-service` → Build booking-service
- ... và các services khác

Mỗi service sẽ:
- ✅ Tự động build khi có thay đổi trong service đó
- ✅ Skip build nếu không có thay đổi (path filtering)
- ✅ Build tất cả trên branch `main`
- ✅ Push image lên Docker Hub

## Troubleshooting

### Jenkins không detect được Jenkinsfiles?

- Kiểm tra **Script Path** có đúng không
- Kiểm tra file Jenkinsfile có trong repo chưa
- Thử scan lại: **Scan Multibranch Pipeline Now**

### Service không build khi có thay đổi?

- Kiểm tra path filtering trong Jenkinsfile của service
- Kiểm tra Git webhook (nếu có)
- Kiểm tra SCM polling triggers

### Build tất cả services mặc dù chỉ một service thay đổi?

- Đây là behavior trên branch `main` (đúng)
- Trên các branch khác, chỉ build service có thay đổi

## So sánh với các options khác

| Option | Ưu điểm | Nhược điểm |
|--------|---------|------------|
| **Multibranch Pipeline** ✅ | Tự động, đơn giản, path filtering | Cần setup ban đầu |
| Separate Jobs | Build độc lập, dễ trigger riêng | Phải maintain nhiều jobs |
| Root Jenkinsfile | Orchestration tập trung | Không thể load pipeline blocks |

## Next Steps

1. ✅ Setup Multibranch Pipeline như hướng dẫn trên
2. ✅ Scan để detect các services
3. ✅ Test bằng cách commit vào một service
4. ✅ Kiểm tra Jenkins tự động build service đó

Chúc bạn thành công! 🎉

