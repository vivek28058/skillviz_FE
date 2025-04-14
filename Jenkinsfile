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
                script {
                    bat """
                    curl -sSfL https://github.com/anchore/syft/releases/download/v0.40.0/syft_0.40.0_windows_x86_64.tar.gz -o syft.tar.gz
                    tar -xvzf syft.tar.gz
                    move syft.exe C:\\Windows\\System32
                    if not exist %REPORT_DIR% mkdir %REPORT_DIR%
                    syft %IMAGE_NAME% -o json > %REPORT_DIR%\\sbom-syft.json
                    """
                }
            }
        }

        stage('Install Grype & Scan for Vulnerabilities') {
            steps {
                script {
                    bat """
                    curl -sSfL https://github.com/anchore/grype/releases/download/v0.32.1/grype_0.32.1_windows_x86_64.tar.gz -o grype.tar.gz
                    tar -xvzf grype.tar.gz
                    move grype.exe C:\\Windows\\System32
                    grype %IMAGE_NAME% -o json > %REPORT_DIR%\\grype-report.json
                    """
                }
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/*.json", allowEmptyArchive: true
            }
        }
    }
}
