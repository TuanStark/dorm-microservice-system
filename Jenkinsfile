// Root Jenkinsfile - Build tất cả services có thay đổi
// LƯU Ý: Multibranch Pipeline vẫn là cách tốt nhất, nhưng file này cho phép build từ root

pipeline {
    agent any
    
    triggers {
        pollSCM('H/5 * * * *')
    }
    
    environment {
        REGISTRY_URL = 'https://index.docker.io/v1/'
        REGISTRY_CREDENTIAL = 'docker-credentials'
        DOCKER_HUB_USERNAME = 'tuanstark'
    }
    
    stages {
        stage('Detect Changed Services') {
            steps {
                script {
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
                    
                    if (env.BRANCH_NAME == 'main' || changedFiles.contains('shared/')) {
                        buildAll = true
                    }
                    
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
            parallel {
                stage('Build api-gateway') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('api-gateway') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/api-gateway') {
                            script {
                                def serviceName = 'api-gateway'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                // Build service trong Docker container với Node.js
                                sh """
                                    docker run --rm -v "\${WORKSPACE}/services/${serviceName}:/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npm test -- --coverage --watchAll=false || true && npm run build"
                                """
                                
                                // Build Docker image
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                
                                // Security scan
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                // Push to Docker Hub
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
                
                stage('Build auth-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('auth-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/auth-service') {
                            script {
                                def serviceName = 'auth-service'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                // Build trong Docker container với Node.js và Prisma
                                sh """
                                    docker run --rm -v "\${WORKSPACE}/services/${serviceName}:/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npx prisma generate && npm test -- --coverage --watchAll=false || true && npm run build"
                                """
                                
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
                
                stage('Build booking-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('booking-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/booking-service') {
                            script {
                                def serviceName = 'booking-service'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                sh '''
                                    docker run --rm -v "$(pwd):/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npx prisma generate && npm test -- --coverage --watchAll=false || true && npm run build"
                                '''
                                
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
                
                stage('Build building-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('building-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/building-service') {
                            script {
                                def serviceName = 'building-service'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                sh '''
                                    docker run --rm -v "$(pwd):/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npx prisma generate && npm test -- --coverage --watchAll=false || true && npm run build"
                                '''
                                
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
                
                stage('Build notification-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('notification-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/notification-service') {
                            script {
                                def serviceName = 'notification-service'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                sh '''
                                    docker run --rm -v "$(pwd):/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npx prisma generate && npm test -- --coverage --watchAll=false || true && npm run build"
                                '''
                                
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
                
                stage('Build payment-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('payment-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/payment-service') {
                            script {
                                def serviceName = 'payment-service'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                sh '''
                                    docker run --rm -v "$(pwd):/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npx prisma generate && npm test -- --coverage --watchAll=false || true && npm run build"
                                '''
                                
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
                
                stage('Build room-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('room-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/room-service') {
                            script {
                                def serviceName = 'room-service'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                sh '''
                                    docker run --rm -v "$(pwd):/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npx prisma generate && npm test -- --coverage --watchAll=false || true && npm run build"
                                '''
                                
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
                
                stage('Build upload-service') {
                    when {
                        expression { 
                            env.CHANGED_SERVICES?.contains('upload-service') || env.BRANCH_NAME == 'main'
                        }
                    }
                    steps {
                        dir('services/upload-service') {
                            script {
                                def serviceName = 'upload-service'
                                def dockerImage = "dorm-booking/${serviceName}"
                                def dockerTag = "${BUILD_NUMBER}"
                                
                                sh '''
                                    docker run --rm -v "$(pwd):/app" -w /app node:18-alpine \
                                    sh -c "npm ci && npm run lint && npm run format && npm test -- --coverage --watchAll=false || true && npm run build"
                                '''
                                
                                docker.build("${dockerImage}:${dockerTag}", "-f Dockerfile .")
                                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${dockerImage}:${dockerTag} || true"
                                
                                def dockerHubImage = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:${dockerTag}"
                                def dockerHubImageLatest = "${env.DOCKER_HUB_USERNAME}/${dockerImage}:latest"
                                
                                docker.withRegistry("${env.REGISTRY_URL}", "${env.REGISTRY_CREDENTIAL}") {
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImage}"
                                    sh "docker tag ${dockerImage}:${dockerTag} ${dockerHubImageLatest}"
                                    sh "docker push ${dockerHubImage}"
                                    sh "docker push ${dockerHubImageLatest}"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
