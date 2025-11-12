pipeline {
    agent any

    environment {
        SERVER_ENV_CONTENT = ''
        CLIENT_ENV_CONTENT = ''
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out code..."
                checkout scm
            }
        }

        stage('Inject Env Files') {
            steps {
                withCredentials([
                    string(credentialsId: 'server_env_file', variable: 'SERVER_ENV'),
                    string(credentialsId: 'client_env_file', variable: 'CLIENT_ENV')
                ]) {
                    script {
                        // Pass credentials into environment variables for Docker build
                        env.SERVER_ENV_CONTENT = SERVER_ENV
                        env.CLIENT_ENV_CONTENT = CLIENT_ENV
                        echo "🔐 Environment files loaded securely."
                    }
                }
            }
        }

        stage('Clean Old Containers') {
            steps {
                echo "🧹 Cleaning old Docker containers and images..."
                sh 'docker compose down'
                sh 'docker system prune -af'
            }
        }

        stage('Build & Deploy') {
            steps {
                echo "🐳 Building Docker images..."
                sh 'docker compose build'
                
                echo "🚀 Deploying Docker containers..."
                sh 'docker compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "🔎 Checking if containers are running..."
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            echo "🧽 Pipeline finished."
        }
        failure {
            echo "❌ Deployment failed. Check logs for details."
        }
    }
}
