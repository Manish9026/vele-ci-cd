pipeline {
    agent any

    environment {
        // Inject secret files
        SERVER_ENV = credentials('server_env_file')
        CLIENT_ENV = credentials('client_env_file')
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                git branch: 'main', url: 'https://github.com/aniketjha348/vele-ci-cd.git'
            }
        }

        stage('Copy .env files') {
            steps {
                echo 'Copying .env files to server and client folders'
                sh 'cp $SERVER_ENV ./server/.env'
                sh 'cp $CLIENT_ENV ./client/.env'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images with injected .env files'
                sh 'docker-compose build'
            }
        }

        stage('Deploy Docker Containers') {
            steps {
                echo 'Deploying Docker containers'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up unused Docker resources'
            sh 'docker system prune -f'
        }
    }
}
