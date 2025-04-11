pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the repository
                git url: 'https://github.com/vivek28058/skillviz_FE.git', branch: 'main'
            }
        }

        stage('Set up Node.js') {
            steps {
                script {
                    // Setting up Node.js environment
                    sh 'curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -'
                    sh 'sudo apt install -y nodejs'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install dependencies using npm
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t myapp:latest .'
                }
            }
        }

        stage('Install Syft') {
            steps {
                script {
                    // Install Syft
                    sh 'curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin'
                }
            }
        }

        stage('Generate SBOM with Syft') {
            steps {
                script {
                    // Generate SBOM (Software Bill of Materials)
                    sh 'syft myapp:latest -o json > sbom.json'
                }
            }
        }

        stage('Install Grype') {
            steps {
                script {
                    // Install Grype
                    sh 'curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin'
                }
            }
        }

        stage('Run Grype Vulnerability Scan') {
            steps {
                script {
                    // Run Grype vulnerability scan
                    sh 'grype myapp:latest -o json > grype-report.json'
                }
            }
        }

        stage('Combine SBOM and Grype Reports') {
            steps {
                script {
                    // Combine SBOM and Grype reports into a single JSON report
                    sh 'jq -s \'{sbom: .[0], grype: .[1]}\' sbom.json grype-report.json > combined-report.json'
                }
            }
        }

        stage('Upload Reports') {
            steps {
                // Archive the reports in Jenkins
                archiveArtifacts artifacts: '**/*.json', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
