// vars/checkServiceChanged.groovy
/**
 * Kiểm tra xem service có thay đổi không
 * 
 * Usage:
 * if (checkServiceChanged('api-gateway')) {
 *     // Build service
 * }
 */

def call(String serviceName) {
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
    
    // Luôn build trên main branch
    if (env.BRANCH_NAME == 'main') {
        return true
    }
    
    // Kiểm tra thay đổi trong thư mục service
    if (changedFiles.contains("services/${serviceName}/")) {
        return true
    }
    
    // Kiểm tra thay đổi trong shared/configs/libs
    if (changedFiles.contains("shared/")) {
        return true
    }
    
    return false
}

