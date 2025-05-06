@Library('devsecops-libs') _  // Load shared library

pipeline {
    agent any

    environment {
        REPORT_DIR = "reports"
    }
    
    stages {
        stage('Run Security Scan') {
            environment {
                DOCKER_USERNAME = credentials('dockerhub-username')
                DOCKER_PASSWORD = credentials('dockerhub-password')
                IMAGE_NAME = 'your-dockerhub-username/your-image-name:tag'  // Replace with actual image
            }
            steps {
                securityscan(DOCKER_USERNAME, DOCKER_PASSWORD, IMAGE_NAME, REPORT_DIR)
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/*.json", fingerprint: true
            }
        }
    }
}
