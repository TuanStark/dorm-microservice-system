// LƯU Ý: File này KHÔNG được dùng với Multibranch Pipeline
// Multibranch Pipeline sẽ tự động detect và chạy Jenkinsfile trong từng service directory
// 
// Nếu bạn muốn dùng root Jenkinsfile (không khuyến nghị):
// - Tạo một Pipeline job riêng và point đến file này
// - Nhưng cách này không tận dụng được path filtering tốt như Multibranch Pipeline
//
// KHUYẾN NGHỊ: Xóa file này và dùng Multibranch Pipeline để tự động detect các service Jenkinsfiles

pipeline {
    agent any
    
    stages {
        stage('Info') {
            steps {
                echo """
                ⚠️  Root Jenkinsfile detected!
                
                💡 KHUYẾN NGHỊ: Sử dụng Multibranch Pipeline thay vì root Jenkinsfile
                
                Cách setup Multibranch Pipeline:
                1. Tạo Multibranch Pipeline job trong Jenkins
                2. Cấu hình Git repository
                3. Set Script Path: services/*/Jenkinsfile
                4. Jenkins sẽ tự động detect và build từng service
                
                Xem chi tiết trong: infrastructure/jenkins/JENKINS_SETUP.md
                """
            }
        }
    }
}
