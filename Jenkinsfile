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
                sh '''
                    echo "🧼 Cleaning up old containers..."
                    docker-compose down || true
                    docker rm -f vele-client vele-server || true
                    docker-compose up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '🔍 Checking running containers...'
                sh 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up unused Docker resources and sensitive files...'
            sh '''
                echo "🗑️ Removing temporary environment files..."
                rm -f ./server/.env ./client/.env || true

                echo "🧼 Pruning unused Docker data..."
                docker system prune -f --volumes || true

                echo "🌀 Rotating Jenkins logs..."
                find /var/log/jenkins -type f -name "*.log" -mtime +10 -exec rm -f {} \\; || true
            '''
        }
    }
}
