pipeline {
    agent any
    environment {
        IMAGE_BACKEND = 'mern-backend'
        IMAGE_FRONTEND = 'mern-frontend'
        TAG = "${env.BUILD_NUMBER ?: 'latest'}"
    }

    stages {
        stage('Checkout Application') {
            steps {
                checkout scm
            }
        }

        stage('Inject Secrets') {
            steps {
                withCredentials([
                    file(credentialsId: 'server_env_file', variable: 'SERVER_ENV_PATH'),
                    file(credentialsId: 'client_env_file', variable: 'CLIENT_ENV_PATH')
                ]) {
                    sh '''
                    echo "Copying server and client env files..."
                    cp "$SERVER_ENV_PATH" ./server/.env
                    cp "$CLIENT_ENV_PATH" ./client/.env
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                echo "Building Docker images..."
                docker-compose -f docker-compose.yml build backend frontend
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                echo "Deploying with docker-compose..."
                docker-compose -f docker-compose.yml down --volumes --remove-orphans || true
                docker-compose -f docker-compose.yml up -d --remove-orphans
                '''
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'rm -f ./server/.env ./client/.env'
        }
    }
}
