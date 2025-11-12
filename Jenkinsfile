pipeline {
    agent any

    environment {
        // Bind secret files from Jenkins credentials
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
                echo '🔐 Injecting .env files securely...'
                sh '''
                    mkdir -p ./server ./client
                    cp "$SERVER_ENV" ./server/.env
                    cp "$CLIENT_ENV" ./client/.env
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Deploy Docker Containers') {
            steps {
                echo '🚀 Deploying Docker containers...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up unused Docker resources and sensitive files...'
            sh '''
                docker system prune -f
                rm -f ./server/.env ./client/.env || true
            '''
        }
    }
}
