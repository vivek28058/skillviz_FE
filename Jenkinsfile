pipeline {
    options {
        skipDefaultCheckout(true)
    }
    agent any

    environment {
        IMAGE_NAME = "vivek2426/777:latest"
        REPORT_DIR = "reports"
        DOCKER_USERNAME = credentials('dockerhub-username') // Jenkins credentials ID
        DOCKER_PASSWORD = credentials('dockerhub-password') // Jenkins credentials ID
    }

    stages {
        stage('Docker Login') {
            steps {
                script {
                    bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"
                }
            }
        }

        stage('Pull Image from Docker Hub') {
            steps {
                script {
                    bat "docker pull %IMAGE_NAME%"
                }
            }
        }

        stage('Install Syft & Generate SBOM') {
            steps {
                bat 'curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -'
                bat ".\\syft %IMAGE_NAME% -o json > %REPORT_DIR%\\sbom.json"
            }
        }

        stage('Install Grype & Scan for Vulnerabilities') {
            steps {
                bat 'curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -'
                bat ".\\grype %IMAGE_NAME% -o json > %REPORT_DIR%\\vuln-report.json"
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/*.json", fingerprint: true
            }
        }
    }
}
