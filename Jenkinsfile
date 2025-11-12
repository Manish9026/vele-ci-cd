pipeline {
    agent any

    environment {
        // You can define other static environment variables here if needed
    }

    stages {
        stage('Checkout Repository') {
            steps {
                echo "🔄 Cloning repository..."
                checkout scm
            }
        }

        stage('Inject .env Files Securely') {
            steps {
                echo "🔐 Injecting environment files securely..."
                withCredentials([
                    file(credentialsId: 'server_env_file', variable: 'SERVER_ENV'),
                    file(credentialsId: 'client_env_file', variable: 'CLIENT_ENV')
                ]) {
                    sh '''
                        mkdir -p ./server ./client
                        cp $SERVER_ENV ./server/.env
                        cp $CLIENT_ENV ./client/.env
                        echo "✅ .env files copied successfully"
                    '''
                }
            }
        }

        stage('Clean Previous Deployment') {
            steps {
                echo "🧹 Cleaning old Docker containers and images..."
                sh '''
                    docker compose -f docker-compose.yml down
                    docker system prune -af
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building new Docker images..."
                sh '''
                    docker build -t vele-backend ./server
                    docker build -t vele-frontend ./client
                '''
            }
        }

        stage('Deploy Docker Containers') {
            steps {
                echo "🚀 Deploying Docker containers..."
                sh '''
                    docker compose -f docker-compose.yml up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "🔎 Verifying deployment..."
                sh '''
                    docker ps
                '''
            }
        }
    }

    post {
        always {
            echo "🧽 Cleaning sensitive files and freeing space..."
            sh '''
                rm -f ./server/.env ./client/.env
                docker system prune -f
            '''
        }

        success {
            echo "✅ Deployment completed successfully!"
        }

        failure {
            echo "❌ Deployment failed. Check logs for details."
        }
    }
}
