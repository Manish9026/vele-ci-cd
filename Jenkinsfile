pipeline {
  agent any

  environment {
    // Match Jenkins credentials IDs for .env files
    SERVER_ENV = credentials('server_env_file')
    CLIENT_ENV = credentials('client_env_file')
    DOCKER_COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {

    stage('🌀 Clone Repository') {
      steps {
        echo '🔄 Cloning repository from GitHub...'
        git branch: 'main', url: 'https://github.com/aniketjha348/vele-ci-cd.git'
      }
    }

    stage('🔐 Inject Environment Files') {
      steps {
        echo 'Setting up environment variables securely...'
        sh '''
          mkdir -p ./server ./client
          echo "→ Copying Jenkins credential .env files..."
          cp "$SERVER_ENV" ./server/.env
          cp "$CLIENT_ENV" ./client/.env
          echo "✅ .env files copied successfully."
        '''
      }
    }

    stage('🧹 Clean Previous Containers & Images') {
      steps {
        echo 'Removing old containers and unused resources...'
        sh '''
          docker compose -f $DOCKER_COMPOSE_FILE down || true
          docker system prune -af || true
        '''
      }
    }

    stage('🐳 Build Fresh Docker Images') {
      steps {
        echo 'Building new Docker images (no cache)...'
        sh '''
          docker compose -f $DOCKER_COMPOSE_FILE build --no-cache
        '''
      }
    }

    stage('🚀 Deploy New Containers') {
      steps {
        echo 'Starting containers in detached mode...'
        sh '''
          docker compose -f $DOCKER_COMPOSE_FILE up -d
          echo "✅ Containers deployed successfully!"
        '''
      }
    }

    stage('🧩 Verify Deployment') {
      steps {
        echo 'Checking running containers...'
        sh '''
          echo "Backend container status:"
          docker compose ps | grep vele-server || echo "⚠️ Backend not running!"
          echo "Frontend container status:"
          docker compose ps | grep vele-client || echo "⚠️ Frontend not running!"
        '''
      }
    }
  }

  post {
    always {
      echo '🧽 Cleaning up sensitive data and unused resources...'
      sh '''
        rm -f ./server/.env ./client/.env || true
        docker system prune -f || true
      '''
    }
    success {
      echo '✅ CI/CD Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed — check the above logs for details.'
    }
  }
}
