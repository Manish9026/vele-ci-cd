pipeline {
    agent any

    environment {
        // Inject secret files securely from Jenkins credentials
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
                    # Create temp folder with restricted access
                    mkdir -p /tmp/jenkins_envs
                    chmod 700 /tmp/jenkins_envs

                    # Copy Jenkins secret files into temp directory
                    cp $SERVER_ENV /tmp/jenkins_envs/server.env
                    cp $CLIENT_ENV /tmp/jenkins_envs/client.env

                    # Move them into the project directories
                    mv /tmp/jenkins_envs/server.env ./server/.env
                    mv /tmp/jenkins_envs/client.env ./client/.env

                    # Restrict permissions to Jenkins user only
                    chmod 600 ./server/.env ./client/.env
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images with environment configuration...'
                sh 'docker-compose build'
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
