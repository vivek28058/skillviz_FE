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
            // Download Syft ZIP version
            bat 'curl -sSfL https://github.com/anchore/syft/releases/download/v1.22.0/syft_1.22.0_windows_amd64.zip -o syft.zip'
            bat 'powershell -Command "Expand-Archive -Path syft.zip -DestinationPath .\\syft"'
            bat 'move .\\syft\\syft.exe C:\\Windows\\System32\\syft.exe' // Ensure syft.exe is available in the PATH
            bat ".\\syft %IMAGE_NAME% -o json > %REPORT_DIR%\\sbom-syft.json"
        }
    }
}

stage('Install Grype & Scan for Vulnerabilities') {
    steps {
        script {
            // Download Grype ZIP version
            bat 'curl -sSfL https://github.com/anchore/grype/releases/download/v0.91.0/grype_0.91.0_windows_amd64.zip -o grype.zip'
            bat 'powershell -Command "Expand-Archive -Path grype.zip -DestinationPath .\\grype"'
            bat 'move .\\grype\\grype.exe C:\\Windows\\System32\\grype.exe' // Ensure grype.exe is available in the PATH
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
