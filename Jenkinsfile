pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_CMD = "docker-compose -f docker-compose.yml"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo '🔄 Cloning repository...'
                git branch: 'main', url: 'https://github.com/aniketjha348/vele-ci-cd.git'
            }
        }

        stage('Inject Environment Variables Securely') {
            steps {
                echo '🔐 Injecting environment variables from Jenkins secret files...'
                withCredentials([
                    file(credentialsId: 'server_env_file', variable: 'SERVER_ENV'),
                    file(credentialsId: 'client_env_file', variable: 'CLIENT_ENV')
                ]) {
                    sh '''
                        # Export all variables from both env files securely
                        set -a
                        source $SERVER_ENV
                        source $CLIENT_ENV
                        set +a
                        echo "✅ Environment variables loaded into environment."
                    '''
                }
            }
        }

        stage('Clean Previous Deployment') {
            steps {
                echo '🧹 Removing old containers and images before new build...'
                sh '''
                    # Stop and remove any existing containers
                    ${DOCKER_COMPOSE_CMD} down --remove-orphans || true

                    # Remove dangling images and unused volumes
                    docker image prune -af || true
                    docker volume prune -f || true

                    echo "✅ Old containers, images, and volumes cleaned up."
                '''
            }
        }

        stage('Build Fresh Docker Images') {
            steps {
                echo '🐳 Building fresh Docker images...'
                sh '''
                    ${DOCKER_COMPOSE_CMD} build --no-cache
                    echo "✅ Docker images built successfully."
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                echo '🚀 Deploying new containers...'
                sh '''
                    ${DOCKER_COMPOSE_CMD} up -d
                    echo "✅ Deployment successful!"
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '🔍 Checking running containers...'
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Deployment failed. Please check logs above.'
        }
        always {
            echo '🧽 Final cleanup of unused Docker resources...'
            sh 'docker system prune -f || true'
        }
    }
}
