pipeline {
    agent any

    environment {
        // Jenkins credentials (file type)
        SERVER_ENV = credentials('server_env_file')
        CLIENT_ENV = credentials('client_env_file')
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo '🔄 Cloning repository...'
                git branch: 'main', url: 'https://github.com/aniketjha348/vele-ci-cd.git'
            }
        }

        stage('Inject .env Files Securely') {
            steps {
                echo '🔐 Injecting environment files securely...'
                sh '''
                    mkdir -p ./server ./client
                    cp "$SERVER_ENV" ./server/.env
                    cp "$CLIENT_ENV" ./client/.env
                    echo "✅ .env files copied successfully."
                '''
            }
        }

        stage('Clean Previous Deployment') {
            steps {
                echo '🧹 Cleaning old Docker containers and images...'
                sh '''
                    docker compose -f docker-compose.yml down || true
                    docker system prune -af || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building new Docker images with environment variables...'
                sh '''
                    echo "🧭 Loading environment variables from .env files..."
                    set -a
                    [ -f ./server/.env ] && source ./server/.env
                    [ -f ./client/.env ] && source ./client/.env
                    set +a

                    docker compose --env-file ./server/.env --env-file ./client/.env -f docker-compose.yml build --no-cache
                '''
            }
        }

        stage('Deploy Docker Containers') {
            steps {
                echo '🚀 Deploying Docker containers...'
                sh '''
                    docker compose --env-file ./server/.env --env-file ./client/.env -f docker-compose.yml up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '🧩 Verifying running containers...'
                sh '''
                    echo "Backend container:"
                    docker ps | grep vele-server || echo "⚠️ Backend not running!"
                    echo "Frontend container:"
                    docker ps | grep vele-client || echo "⚠️ Frontend not running!"
                '''
            }
        }
    }

    post {
        always {
            echo '🧽 Cleaning sensitive files and freeing space...'
            sh '''
                rm -f ./server/.env ./client/.env || true
                docker system prune -f || true
            '''
        }
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Deployment failed. Check Jenkins logs for details.'
        }
    }
}
