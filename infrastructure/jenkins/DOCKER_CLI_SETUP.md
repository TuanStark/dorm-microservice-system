# Hướng dẫn Setup Docker CLI cho Jenkins Container

## Vấn đề
Jenkins container không có Docker CLI, dẫn đến lỗi `docker: not found` khi chạy npm commands trong Docker container.

## Giải pháp

### Option 1: Dùng Dockerfile custom (Khuyến nghị)

1. **Tạo Dockerfile.jenkins** (đã tạo sẵn trong `infrastructure/jenkins/Dockerfile.jenkins`)

2. **Cập nhật docker-compose.yml** để build từ Dockerfile:
   ```yaml
   services:
     jenkins:
       build:
         context: .
         dockerfile: Dockerfile.jenkins
   ```

3. **Rebuild Jenkins container**:
   ```bash
   cd infrastructure/jenkins
   docker-compose down
   docker-compose build jenkins
   docker-compose up -d
   ```

### Option 2: Cài Docker CLI vào container đang chạy

```bash
# Exec vào Jenkins container
docker exec -it booking_jenkins bash

# Cài Docker CLI
apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce-cli

# Verify
docker --version
```

**Lưu ý**: Cách này sẽ mất khi container restart. Nên dùng Option 1.

### Option 3: Dùng image có sẵn Docker CLI

Sử dụng image custom có Docker CLI:
```yaml
image: jenkins/jenkins:lts-dind  # Không tồn tại, cần build custom
```

Hoặc dùng image: `jenkinsci/jenkins:lts` với Docker CLI được cài sẵn.

## Verify Docker CLI trong Jenkins

Sau khi setup, vào Jenkins:
1. **Manage Jenkins** → **Script Console**
2. Chạy script:
   ```groovy
   sh 'docker --version'
   ```
3. Nếu hiển thị version → thành công ✅

## Kiểm tra Docker socket

Đảm bảo Docker socket được mount đúng:
```bash
docker exec booking_jenkins ls -la /var/run/docker.sock
# Kết quả: /var/run/docker.sock → /var/run/docker.sock
```

## Troubleshooting

### Lỗi "permission denied" khi chạy docker commands?
- Jenkins user cần trong docker group:
  ```bash
  docker exec -u root booking_jenkins usermod -aG docker jenkins
  ```

### Lỗi "Cannot connect to the Docker daemon"?
- Kiểm tra Docker socket đã được mount chưa
- Kiểm tra Docker daemon trên host đang chạy

### Không muốn dùng Docker CLI?
- Xem Option trong Jenkinsfile: Dùng Node.js trực tiếp (đã có trong code)

