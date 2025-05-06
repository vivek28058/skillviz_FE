@Library('devsecops-libs') _  // Load shared lib

pipeline {
    agent any

    environment {
        IMAGE_NAME = credentials('Container-Image')
        REPORT_DIR = "reports"
        DOCKER_USERNAME = credentials('dockerhub-username')
        DOCKER_PASSWORD = credentials('dockerhub-password')
    }

    stages {
        stage('Run Security Scan') {
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
