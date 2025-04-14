pipeline {
    agent any

    environment {
        IMAGE_NAME = "your-image-name:latest"
        REPORT_DIR = "reports"
    }

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/vivek28058/skillviz_FE.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $IMAGE_NAME ."
                }
            }
        }

        stage('Install Syft & Generate SBOM') {
            steps {
                script {
                    sh """
                    curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin
                    mkdir -p $REPORT_DIR
                    syft $IMAGE_NAME -o json > $REPORT_DIR/sbom-syft.json
                    """
                }
            }
        }

        stage('Install Grype & Scan for Vulnerabilities') {
            steps {
                script {
                    sh """
                    curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
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
