pipeline {
    agent any

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
                    file(credentialsId: 'server_env_file', variable: 'SERVER_ENV_FILE_PATH'),
                    file(credentialsId: 'client_env_file', variable: 'CLIENT_ENV_FILE_PATH')
                ]) {
                    script {
                        echo "🔐 Copying secret env files..."
                        sh '''
                        cp "$SERVER_ENV_FILE_PATH" ./server/.env
                        cp "$CLIENT_ENV_FILE_PATH" ./client/.env
                        '''
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
