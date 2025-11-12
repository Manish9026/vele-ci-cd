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
        stage('Checkout Application') {
            steps {
                dir('app') {
                    git branch: 'main', credentialsId: 'github-pat', url: 'https://github.com/aniketjha348/vele.git'
                }
            }
        }

        stage('Inject Secrets') {
            steps {
                dir('app') {
                    // Inject server and client .env files securely
                    withCredentials([
                        file(credentialsId: 'server_env_file', variable: 'SERVER_ENV_PATH'),
                        file(credentialsId: 'client_env_file', variable: 'CLIENT_ENV_PATH')
                    ]) {
                        sh '''
                        echo "Copying server and client env files..."
                        mkdir -p server client
                        cp $SERVER_ENV_PATH ./server/.env
                        cp $CLIENT_ENV_PATH ./client/.env
                        '''
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh '''
                    echo "Installing backend dependencies..."
                    cd server && npm install
                    echo "Installing frontend dependencies..."
                    cd ../client && npm install
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                dir('app') {
                    sh '''
                    echo "Building backend..."
                    cd server && npm run build
                    echo "Building frontend..."
                    cd ../client && npm run build
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                dir('app') {
                    sh '''
                    echo "Building Docker images..."
                    docker build -t $DOCKER_REGISTRY/$IMAGE_BACKEND:$TAG ./server
                    docker build -t $DOCKER_REGISTRY/$IMAGE_FRONTEND:$TAG ./client
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                dir('app') {
                    sh '''
                    echo "Pushing Docker images..."
                    docker push $DOCKER_REGISTRY/$IMAGE_BACKEND:$TAG
                    docker push $DOCKER_REGISTRY/$IMAGE_FRONTEND:$TAG
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                dir('app') {
                    sh '''
                    echo "Deploying with docker-compose..."
                    docker-compose down
                    docker-compose up -d --build
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            dir('app') {
                sh 'rm -f ./server/.env ./client/.env'
            }
        }
    }
}
