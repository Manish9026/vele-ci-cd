pipeline {
    agent any
    environment {
        // Optional: define Docker registry if pushing images
        DOCKER_REGISTRY = 'your-dockerhub-username'
        IMAGE_BACKEND = 'mern-backend'
        IMAGE_FRONTEND = 'mern-frontend'
        TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Inject Secrets') {
            steps {
                // Inject server and client .env files securely
                withCredentials([
                    file(credentialsId: 'SERVER_ENV_FILE', variable: 'SERVER_ENV_PATH'),
                    file(credentialsId: 'CLIENT_ENV_FILE', variable: 'CLIENT_ENV_PATH')
                ]) {
                    sh '''
                    echo "Copying server and client env files..."
                    cp $SERVER_ENV_PATH ./server/.env
                    cp $CLIENT_ENV_PATH ./client/.env
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing backend dependencies..."
                cd server && npm install
                echo "Installing frontend dependencies..."
                cd ../client && npm install
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                echo "Building backend..."
                cd server && npm run build
                echo "Building frontend..."
                cd ../client && npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                echo "Building Docker images..."
                docker build -t $DOCKER_REGISTRY/$IMAGE_BACKEND:$TAG ./server
                docker build -t $DOCKER_REGISTRY/$IMAGE_FRONTEND:$TAG ./client
                '''
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                echo "Pushing Docker images..."
                docker push $DOCKER_REGISTRY/$IMAGE_BACKEND:$TAG
                docker push $DOCKER_REGISTRY/$IMAGE_FRONTEND:$TAG
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                echo "Deploying with docker-compose..."
                docker-compose down
                docker-compose up -d --build
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
