pipeline {
    agent any

    environment {
        IMAGE_NAME = "your-image-name:latest"
        REPORT_DIR = "reports"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()  // This will clean the workspace
            }
        }

        stage('Clone Repo') {
            steps {
                git 'https://github.com/vivek28058/skillviz_FE.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t $IMAGE_NAME ."
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
                    mkdir -p $REPORT_DIR
                    syft $IMAGE_NAME -o json > $REPORT_DIR/sbom-syft.json
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
                    grype $IMAGE_NAME -o json > $REPORT_DIR/grype-report.json
                    """
                }
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: "$REPORT_DIR/*.json", allowEmptyArchive: true
            }
        }
    }
}
