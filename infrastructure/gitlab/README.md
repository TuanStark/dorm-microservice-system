# GitLab Docker Setup

## Mô tả
Docker Compose configuration cho GitLab Community Edition với cấu hình tối ưu cho môi trường development.

## Cấu hình

### Ports
- **8929**: GitLab Web Interface (HTTP)
- **2224**: GitLab SSH (cho Git operations)

### Environment Variables
- `GITLAB_OMNIBUS_CONFIG`: Cấu hình GitLab Omnibus
- `external_url`: URL external của GitLab
- `gitlab_shell_ssh_port`: Port SSH cho Git operations

### Volumes
- `gitlab_config`: Cấu hình GitLab
- `gitlab_logs`: Log files
- `gitlab_data`: Dữ liệu GitLab (repositories, database, etc.)

## Sử dụng

### Khởi động GitLab
```bash
docker-compose up -d
```

### Kiểm tra trạng thái
```bash
docker-compose ps
docker logs booking_gitlab
```

### Truy cập GitLab
- URL: http://localhost:8929
- Username mặc định: `root`
- Password sẽ được tạo tự động và hiển thị trong logs

### Lấy password root
```bash
docker exec -it booking_gitlab grep 'Password:' /etc/gitlab/initial_root_password
```

### Dừng GitLab
```bash
docker-compose down
```

### Backup
```bash
docker exec -it booking_gitlab gitlab-backup create
```

## Cấu hình Local
GitLab được cấu hình để chạy trên localhost với port 8929.

## Lưu ý
- GitLab cần ít nhất 4GB RAM để hoạt động tốt
- Lần đầu khởi động có thể mất 5-10 phút
- Đảm bảo có đủ dung lượng disk cho repositories
