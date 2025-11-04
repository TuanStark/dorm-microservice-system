// Jenkinsfile ở root cho Multibranch Pipeline
// Tự động detect và build các service có thay đổi

pipeline {
    agent any

    triggers {
        // Poll SCM mỗi 5 phút để detect commit mới
        pollSCM('H/5 * * * *')
    }

    environment {
        REGISTRY_URL = 'https://index.docker.io/v1/'  // ví dụ: registry.hub.docker.com
        REGISTRY_CREDENTIAL = 'docker-credentials' // ID credentials trong Jenkins
    }

    stages {
        stage('Detect Changed Services') {
            steps {
                script {
                    // Các service trong hệ thống
                    def services = [
                        'api-gateway',
                        'auth-service',
                        'booking-service',
                        'building-service',
                        'notification-service',
                        'payment-service',
                        'room-service',
                        'upload-service'
                    ]

                    // Lấy danh sách file thay đổi
                    def changedFiles = sh(
                        script: """
                            if [ -n "\${GIT_PREVIOUS_SUCCESSFUL_COMMIT}" ]; then
                                git diff --name-only \${GIT_PREVIOUS_SUCCESSFUL_COMMIT} \${GIT_COMMIT}
                            else
                                git diff --name-only HEAD~1 HEAD
                            fi
                        """,
                        returnStdout: true
                    ).trim()

                    changedFiles = changedFiles ?: ""
                    echo "Changed files:\n${changedFiles}"

                    def changedServices = []
                    def buildAll = false

                    // Build tất cả nếu là nhánh main hoặc có thay đổi trong shared/
                    if (env.BRANCH_NAME == 'main' || changedFiles.contains('shared/')) {
                        buildAll = true
                    }

                    // Kiểm tra từng service
                    services.each { service ->
                        if (buildAll || changedFiles.contains("services/${service}/")) {
                            changedServices.add(service)
                        }
                    }

                    if (changedServices.isEmpty() && !buildAll) {
                        echo "No services changed, skipping build."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

                    // Set CHANGED_SERVICES env variable (hoặc tất cả services nếu buildAll)
                    if (buildAll) {
                        env.CHANGED_SERVICES = services.join(',')
                    } else {
                        env.CHANGED_SERVICES = changedServices.join(',')
                    }
                    echo "Services to build: ${env.CHANGED_SERVICES}"
                }
            }
        }

        stage('Build Changed Services') {
            steps {
                script {
                    // Nếu nhánh main → build tất cả, ngược lại build những service thay đổi
                    def services = [
                        'api-gateway',
                        'auth-service',
                        'booking-service',
                        'building-service',
                        'notification-service',
                        'payment-service',
                        'room-service',
                        'upload-service'
                    ]

                    def buildTargets = []
                    if (env.BRANCH_NAME == 'main') {
                        buildTargets = services
                    } else {
                        // Xử lý trường hợp CHANGED_SERVICES có thể null hoặc rỗng
                        if (env.CHANGED_SERVICES && env.CHANGED_SERVICES.trim()) {
                            buildTargets = env.CHANGED_SERVICES.split(',').findAll { it?.trim() }
                        } else {
                            echo "No services to build, skipping..."
                            return
                        }
                    }

                    echo "Final build targets: ${buildTargets}"

                    // Tạo parallel build cho từng service
                    def parallelStages = buildTargets.collectEntries { service ->
                        ["Build ${service}" : {
                            dir("services/${service}") {
                                echo "🏗️  Building service: ${service}"
                                // Gọi Jenkinsfile của service tương ứng
                                load 'Jenkinsfile'
                            }
                        }]
                    }

                    parallel parallelStages
                }
            }
        }
    }
}
