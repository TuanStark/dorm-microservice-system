# Jenkins CI/CD Setup cho Monorepo

## Tổng quan

Repository này đã được cấu hình để hỗ trợ CI/CD với Jenkins cho monorepo, bao gồm:

- ✅ **Shared Library** để tái sử dụng pipeline logic
- ✅ **Path Filtering** để chỉ build service có thay đổi
- ✅ **Multibranch Pipeline** support
- ✅ **Docker Hub integration** để push images

## Cấu trúc Files

```
dorm-booking-system/
├── Jenkinsfile                              # Root Jenkinsfile (cho parallel builds)
├── services/
│   ├── api-gateway/
│   │   └── Jenkinsfile                     # Pipeline với path filtering
│   └── [other-services]/
│       └── Jenkinsfile                     # Mỗi service có Jenkinsfile riêng
└── infrastructure/
    └── jenkins/
        ├── JENKINS_SETUP.md                # Hướng dẫn chi tiết setup
        └── shared-library/
            └── vars/
                ├── buildService.groovy     # Shared function để build service
                └── checkServiceChanged.groovy # Kiểm tra service có thay đổi
```

## Tính năng chính

### 1. Path Filtering
- Tự động skip build nếu service không có thay đổi (trừ branch `main`)
- Build tất cả services nếu có thay đổi trong `shared/`
- Luôn build tất cả trên branch `main`

### 2. Shared Library
- Tái sử dụng pipeline logic cho tất cả services
- Dễ dàng maintain và update

### 3. Docker Hub Integration
- Tự động push images lên Docker Hub
- Tag với BUILD_NUMBER và `latest`

## Quick Start

### 1. Setup Shared Library trong Jenkins

1. Vào **Manage Jenkins** → **Configure System**
2. Tìm **Global Pipeline Libraries**
3. Thêm library:
   - **Name**: `dorm-booking-shared-library`
   - **Default version**: `main`
   - **Retrieval method**: Modern SCM → Git
   - **Project Repository**: URL repo này
   - **Library Path**: `infrastructure/jenkins/shared-library`

### 2. Tạo Multibranch Pipeline

1. **New Item** → **Multibranch Pipeline**
2. **Branch Sources** → **Git**
   - Repository URL: URL repo của bạn
   - **Behaviours** → **Add** → **Path Filter**
     - Include: `services/api-gateway/**` (cho mỗi service)
3. **Build Configuration**:
   - **Mode**: By Jenkinsfile
   - **Script Path**: `services/*/Jenkinsfile`

### 3. Setup Credentials

1. **Docker Hub Credentials**:
   - ID: `docker-credentials`
   - Type: Username with password
   - Username: Docker Hub username
   - Password: Docker Hub password/token

## Cách sử dụng

### Option 1: Multibranch Pipeline (Khuyến nghị)
- Jenkins tự động detect và build mỗi service
- Path filtering tự động hoạt động

### Option 2: Separate Jobs
- Tạo job riêng cho mỗi service
- Setup path filtering trong job config

### Option 3: Root Jenkinsfile
- Dùng file `Jenkinsfile` ở root
- Build tất cả services song song

### Option 4: Shared Library
- Trong Jenkinsfile của service:
```groovy
@Library('dorm-booking-shared-library') _

buildService([
    serviceName: 'api-gateway',
    servicePort: '3000',
    hasDatabase: false,
    dockerHubUsername: 'tuanstark'
])
```

## Xem chi tiết

Xem file `infrastructure/jenkins/JENKINS_SETUP.md` để có hướng dẫn chi tiết về:
- Setup từng bước
- Troubleshooting
- Best practices
- Các cách tiếp cận khác nhau

## Lưu ý

- Path filtering chỉ hoạt động trên các branch khác `main`
- Branch `main` luôn build tất cả services
- Thay đổi trong `shared/` sẽ trigger build tất cả services
- Cần cấu hình Docker Hub credentials trước khi push images

