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
                    // Install Syft (updated URL)
                    bat 'curl -sSfL https://github.com/anchore/syft/releases/download/v0.46.0/syft_0.46.0_windows_x86_64.tar.gz -o syft.tar.gz'
                    bat 'tar -xvzf syft.tar.gz'
                    bat 'move syft.exe C:\\Windows\\System32\\syft.exe' // Ensure syft.exe is available in the PATH
                    bat ".\\syft %IMAGE_NAME% -o json > %REPORT_DIR%\\sbom-syft.json"
                }
            }
        }

        stage('Install Grype & Scan for Vulnerabilities') {
            steps {
                script {
                    // Install Grype
                    bat 'curl -sSfL https://github.com/anchore/grype/releases/download/v0.40.0/grype_0.40.0_windows_x86_64.tar.gz -o grype.tar.gz'
                    bat 'tar -xvzf grype.tar.gz'
                    bat 'move grype.exe C:\\Windows\\System32\\grype.exe'
                    bat ".\\grype %IMAGE_NAME% -o json > %REPORT_DIR%\\vuln-report-grype.json"
                }
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/*.json", fingerprint: true
            }
        }
    }
}
