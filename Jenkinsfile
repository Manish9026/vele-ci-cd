pipeline {
    agent any

    environment {
        SERVER_ENV = credentials('server_env_file')
        CLIENT_ENV = credentials('client_env_file')
    }

    stages {

        stage('Checkout Repository') {
            steps {
                echo "🔄 Checking out code from GitHub..."
                checkout scm
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

        stage('Build Backend Docker Image') {
            steps {
                echo "🐳 Building backend Docker image securely..."
                sh '''
                    echo "$SERVER_ENV" > temp_server.env
                    docker build --build-arg SERVER_ENV_FILE=temp_server.env -t vele-backend ./server
                    rm -f temp_server.env
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo "🐳 Building frontend Docker image securely..."
                sh '''
                    echo "$CLIENT_ENV" > temp_client.env
                    docker build --build-arg CLIENT_ENV_FILE=temp_client.env -t vele-frontend ./client
                    rm -f temp_client.env
                '''
            }
        }

        stage('Deploy Docker Containers') {
            steps {
                echo "🚀 Deploying containers with Docker Compose..."
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
            echo "🧽 Cleanup finished."
        }

        success {
            echo "✅ Deployment succeeded!"
        }

        failure {
            echo "❌ Deployment failed. Check Jenkins logs for details."
        }
    }
}
