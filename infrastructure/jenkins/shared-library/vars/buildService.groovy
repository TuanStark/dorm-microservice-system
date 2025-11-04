// vars/buildService.groovy
/**
 * Shared library function để build một service trong monorepo
 * 
 * Usage trong Jenkinsfile:
 * @Library('dorm-booking-shared-library') _
 * 
 * buildService([
 *     serviceName: 'api-gateway',
 *     servicePort: '3000',
 *     hasDatabase: false,
 *     dockerHubUsername: 'tuanstark'
 * ])
 */

def call(Map config) {
    def serviceName = config.serviceName
    def servicePort = config.servicePort ?: '3000'
    def hasDatabase = config.hasDatabase ?: false
    def dockerHubUsername = config.dockerHubUsername ?: 'tuanstark'
    def dockerCredentialsId = config.dockerCredentialsId ?: 'docker-credentials'
    def dockerRegistry = config.dockerRegistry ?: 'https://index.docker.io/v1/'
    
    pipeline {
        agent any
        
        environment {
            SERVICE_NAME = "${serviceName}"
            SERVICE_PORT = "${servicePort}"
            DOCKER_IMAGE = "dorm-booking/${serviceName}"
            DOCKER_TAG = "${BUILD_NUMBER}"
            NODE_VERSION = '18'
            DOCKER_HUB_USERNAME = "${dockerHubUsername}"
            DOCKER_REGISTRY = "${dockerRegistry}"
            DOCKER_CREDENTIALS_ID = "${dockerCredentialsId}"
        }
        
        stages {
            stage('Checkout') {
                steps {
                    checkout scm
                    script {
                        env.GIT_COMMIT_SHORT = sh(
                            script: "git rev-parse --short HEAD",
                            returnStdout: true
                        ).trim()
                    }
                }
            }
            
            stage('Install Dependencies') {
                steps {
                    dir("services/${SERVICE_NAME}") {
                        sh 'npm ci'
                    }
                }
            }
            
            stage('Lint & Format') {
                steps {
                    dir("services/${SERVICE_NAME}") {
                        sh 'npm run lint'
                        sh 'npm run format'
                    }
                }
            }
            
            stage('Database Migration') {
                when {
                    expression { hasDatabase }
                }
                steps {
                    dir("services/${SERVICE_NAME}") {
                        sh 'npx prisma generate'
                        sh 'npx prisma migrate deploy'
                    }
                }
            }
            
            stage('Unit Tests') {
                steps {
                    dir("services/${SERVICE_NAME}") {
                        sh 'npm test -- --coverage --watchAll=false'
                    }
                }
                post {
                    always {
                        publishTestResults testResultsPattern: "services/${SERVICE_NAME}/coverage/test-results.xml"
                        publishCoverage adapters: [
                            jacocoAdapter("services/${SERVICE_NAME}/coverage/lcov.info")
                        ], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                    }
                }
            }
            
            stage('Build Application') {
                steps {
                    dir("services/${SERVICE_NAME}") {
                        sh 'npm run build'
                    }
                }
            }
            
            stage('Build Docker Image') {
                steps {
                    script {
                        docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "-f services/${SERVICE_NAME}/Dockerfile services/${SERVICE_NAME}")
                    }
                }
            }
            
            stage('Security Scan') {
                steps {
                    script {
                        sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    }
                }
            }
            
            stage('Push Docker Image') {
                steps {
                    script {
                        def dockerHubImage = "${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                        def dockerHubImageLatest = "${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}:latest"
                        
                        docker.withRegistry("${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
                            sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${dockerHubImage}"
                            sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${dockerHubImageLatest}"
                            sh "docker push ${dockerHubImage}"
                            sh "docker push ${dockerHubImageLatest}"
                        }
                    }
                }
            }
        }
        
        post {
            always {
                cleanWs()
            }
            success {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        echo "✅ ${SERVICE_NAME} built and pushed successfully!"
                    }
                }
            }
            failure {
                echo "❌ ${SERVICE_NAME} build failed! Check logs."
            }
        }
    }
}

