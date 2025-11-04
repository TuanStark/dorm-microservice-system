# Hướng dẫn Setup Jenkins Multibranch Pipeline cho Monorepo

## Tổng quan

Repository này sử dụng **Monorepo** với các services trong thư mục `services/`. Mỗi service có Jenkinsfile riêng để có thể build độc lập.

## Cấu trúc

```
dorm-booking-system/
├── Jenkinsfile                    # Root Jenkinsfile (Optional - cho Multibranch Pipeline)
├── services/
│   ├── api-gateway/
│   │   └── Jenkinsfile           # Pipeline riêng cho api-gateway
│   ├── auth-service/
│   │   └── Jenkinsfile           # Pipeline riêng cho auth-service
│   └── ...
└── infrastructure/
    └── jenkins/
        └── shared-library/        # Shared library cho Jenkins
            └── vars/
                ├── buildService.groovy
                └── checkServiceChanged.groovy
```

## Cách 1: Multibranch Pipeline (Khuyến nghị)

### Bước 1: Setup Shared Library trong Jenkins

1. Vào **Manage Jenkins** → **Configure System**
2. Tìm mục **Global Pipeline Libraries**
3. Thêm library mới:
   - **Name**: `dorm-booking-shared-library`
   - **Default version**: `main` hoặc `master`
   - **Retrieval method**: 
     - Chọn **Modern SCM**
     - **Source Code Management**: Git
     - **Project Repository**: URL đến repo này (hoặc repo riêng nếu bạn tách shared library)
     - **Credentials**: (nếu cần)
     - **Library Path**: `infrastructure/jenkins/shared-library`

### Bước 2: Tạo Multibranch Pipeline Job

1. **New Item** → Chọn **Multibranch Pipeline**
2. **Branch Sources**:
   - Thêm **Git** source
   - **Project Repository**: URL repo của bạn
   - **Credentials**: (nếu cần)
   - **Behaviours** → **Add** → **Filter by name (with regular expression)**
     - Include: `main|develop|feature/.*` (hoặc pattern bạn muốn)

3. **Build Configuration**:
   - **Mode**: **By Jenkinsfile**
   - **Script Path**: `services/*/Jenkinsfile` (Jenkins sẽ tự động detect)

4. **Scan Multibranch Pipeline Triggers**:
   - Check **Scan periodically**
   - Interval: `H/15 * * * *` (mỗi 15 phút)

### Bước 3: Path Filtering (Quan trọng!)

Để chỉ build service có thay đổi, bạn có 2 cách:

#### Cách A: Sử dụng Path Filter Plugin (Khuyến nghị)

1. Cài đặt plugin **Path Filter Plugin** trong Jenkins
2. Trong **Branch Sources** → **Behaviours** → **Add** → **Path Filter**
   - **Include**: `services/api-gateway/**` (cho mỗi service)
   - **Exclude**: (để trống)

**Lưu ý**: Với Multibranch Pipeline, bạn cần tạo job riêng cho mỗi service hoặc dùng một job tổng hợp.

#### Cách B: Sử dụng khi condition trong Jenkinsfile

Đã có sẵn trong các Jenkinsfile của services:
```groovy
when {
    anyOf {
        changeset "services/${SERVICE_NAME}/**"
        branch 'main'
    }
}
```

## Cách 2: Separate Jobs cho mỗi Service

Nếu không muốn dùng Multibranch Pipeline:

### Bước 1: Tạo Pipeline Job cho mỗi service

1. **New Item** → **Pipeline**
2. **Definition**: **Pipeline script from SCM**
   - **SCM**: Git
   - **Repository URL**: URL repo của bạn
   - **Script Path**: `services/api-gateway/Jenkinsfile` (thay đổi cho mỗi service)

### Bước 2: Setup Path Filtering

1. Trong **Source Code Management** → **Additional Behaviours** → **Add**
2. Chọn **Polling ignores commits in certain paths**
   - **Excluded Regions**: 
     ```
     ^(?!services/api-gateway/).*$
     ```
     (Regex này sẽ ignore tất cả thay đổi KHÔNG trong `services/api-gateway/`)

## Cách 3: Sử dụng Shared Library

Thay vì copy-paste Jenkinsfile, bạn có thể dùng shared library:

### Trong Jenkinsfile của service:

```groovy
@Library('dorm-booking-shared-library') _

buildService([
    serviceName: 'api-gateway',
    servicePort: '3000',
    hasDatabase: false,
    dockerHubUsername: 'tuanstark',
    dockerCredentialsId: 'docker-credentials'
])
```

### Hoặc với path checking:

```groovy
@Library('dorm-booking-shared-library') _

if (checkServiceChanged('api-gateway')) {
    buildService([
        serviceName: 'api-gateway',
        servicePort: '3000',
        hasDatabase: false,
        dockerHubUsername: 'tuanstark'
    ])
} else {
    echo "No changes in api-gateway, skipping build"
}
```

## Cách 4: Root Jenkinsfile (Parallel Build)

File `Jenkinsfile` ở root có thể build tất cả services song song và tự động detect thay đổi.

**Sử dụng**:
- **New Item** → **Pipeline**
- **Script Path**: `Jenkinsfile` (ở root)

## Credentials cần setup

1. **Docker Hub Credentials**:
   - **ID**: `docker-credentials`
   - **Type**: Username with password
   - **Username**: Docker Hub username
   - **Password**: Docker Hub password hoặc Access Token

2. **Database URL** (nếu cần):
   - **ID**: `database-url`
   - **Type**: Secret text
   - **Secret**: Database connection string

## Testing

1. Commit thay đổi vào một service
2. Push lên repo
3. Jenkins sẽ tự động detect và build service đó
4. Kiểm tra logs để đảm bảo path filtering hoạt động đúng

## Troubleshooting

### Pipeline không trigger khi có thay đổi?

- Kiểm tra **Polling** đã được cấu hình chưa
- Kiểm tra **Path Filter** có đúng không
- Kiểm tra **Branch Sources** có include branch của bạn không

### Shared library không load?

- Kiểm tra **Global Pipeline Libraries** đã được cấu hình đúng chưa
- Kiểm tra **Library Path** có đúng không
- Kiểm tra git permissions

### Build tất cả services mặc dù chỉ một service thay đổi?

- Kiểm tra **when condition** trong Jenkinsfile
- Kiểm tra **Path Filter** trong job configuration
- Kiểm tra logic trong `checkServiceChanged.groovy`

## Best Practices

1. ✅ Luôn build tất cả services trên `main` branch
2. ✅ Chỉ build service có thay đổi trên các branch khác
3. ✅ Build tất cả services nếu có thay đổi trong `shared/`
4. ✅ Sử dụng shared library để tránh code duplication
5. ✅ Setup proper credentials management
6. ✅ Monitor build times và optimize nếu cần

## References

- [Jenkins Multibranch Pipeline](https://www.jenkins.io/doc/book/pipeline/multibranch/)
- [Jenkins Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
- [Path Filter Plugin](https://plugins.jenkins.io/pathignore/)

