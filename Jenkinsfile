pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        TAG = "${env.BUILD_NUMBER ?: 'local'}"
        BACKEND_IMAGE = 'mern-backend'
        FRONTEND_IMAGE = 'mern-frontend'
        BACKEND_PORT = '5000'
        FRONTEND_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()
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

        stage('Build Images') {
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
                echo "Redeploying stack..."
                docker-compose -f docker-compose.yml down --volumes --remove-orphans || true
                docker-compose -f docker-compose.yml up -d --remove-orphans backend frontend
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "Waiting for services to become healthy..."
                sleep 10
                curl --fail --retry 5 --retry-connrefused --retry-delay 5 http://127.0.0.1:${BACKEND_PORT:-5000}/api/health
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed for build #${env.BUILD_NUMBER}"
        }
        failure {
            echo "❌ Deployment failed for build #${env.BUILD_NUMBER}"
        }
        always {
            sh 'rm -f ./server/.env ./client/.env'
            sh 'docker-compose -f docker-compose.yml ps'
        }
    }
}
