// Jenkinsfile ở root - cho Multibranch Pipeline
// File này sẽ tự động detect Jenkinsfile trong mỗi service directory

pipeline {
    agent any
    
    stages {
        stage('Detect Changed Services') {
            steps {
                script {
                    // Lấy danh sách các services có thay đổi
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
                    
                    def changedServices = []
                    def buildAll = false
                    
                    // Luôn build tất cả trên main branch
                    if (env.BRANCH_NAME == 'main') {
                        buildAll = true
                    }
                    
                    // Kiểm tra thay đổi trong shared/ thì build tất cả
                    if (changedFiles.contains('shared/')) {
                        buildAll = true
                    }
                    
                    // Kiểm tra từng service
                    services.each { service ->
                        if (buildAll || changedFiles.contains("services/${service}/")) {
                            changedServices.add(service)
                        }
                    }
                    
                    env.CHANGED_SERVICES = changedServices.join(',')
                    echo "Changed services: ${env.CHANGED_SERVICES}"
                    
                    if (changedServices.isEmpty() && !buildAll) {
                        echo "No services changed, skipping build"
                        currentBuild.result = 'SUCCESS'
                    }
                }
            }
        }
        
        stage('Build Changed Services') {
            parallel {
                stage('Build api-gateway') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('api-gateway') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/api-gateway') {
                            script {
                                load '../services/api-gateway/Jenkinsfile'
                            }
                        }
                    }
                }
                
                stage('Build auth-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('auth-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/auth-service') {
                            script {
                                load '../services/auth-service/Jenkinsfile'
                            }
                        }
                    }
                }
                
                stage('Build booking-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('booking-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/booking-service') {
                            script {
                                load '../services/booking-service/Jenkinsfile'
                            }
                        }
                    }
                }
                
                stage('Build building-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('building-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/building-service') {
                            script {
                                load '../services/building-service/Jenkinsfile'
                            }
                        }
                    }
                }
                
                stage('Build notification-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('notification-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/notification-service') {
                            script {
                                load '../services/notification-service/Jenkinsfile'
                            }
                        }
                    }
                }
                
                stage('Build payment-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('payment-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/payment-service') {
                            script {
                                load '../services/payment-service/Jenkinsfile'
                            }
                        }
                    }
                }
                
                stage('Build room-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('room-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/room-service') {
                            script {
                                load '../services/room-service/Jenkinsfile'
                            }
                        }
                    }
                }
                
                stage('Build upload-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES.contains('upload-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/upload-service') {
                            script {
                                load '../services/upload-service/Jenkinsfile'
                            }
                        }
                    }
                }
            }
        }
    }
    triggers {
        pollSCM('H/5 * * * *')
    }
}

