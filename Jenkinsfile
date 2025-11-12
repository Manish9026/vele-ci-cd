pipeline {
  agent any

  environment {
    // Define registry or common variables here if needed
    DOCKER_COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {

    stage('Clone Repository') {
      steps {
        echo "🔄 Cloning repository..."
        git branch: 'main', url: 'https://github.com/aniketjha348/vele-ci-cd.git'
      }
    }

    stage('Inject Environment Variables Securely') {
      steps {
        echo "🔐 Injecting environment variables from Jenkins secret files..."
        withCredentials([
          file(credentialsId: 'server-env', variable: 'SERVER_ENV'),
          file(credentialsId: 'client-env', variable: 'CLIENT_ENV')
        ]) {
          sh '''
            #!/bin/bash
            echo "→ Using bash shell for environment setup..."
            set -a
            if [ -f "$SERVER_ENV" ]; then
              echo "Loading server environment variables..."
              source "$SERVER_ENV"
            else
              echo "⚠️ No server .env file found!"
            fi

            if [ -f "$CLIENT_ENV" ]; then
              echo "Loading client environment variables..."
              source "$CLIENT_ENV"
            else
              echo "⚠️ No client .env file found!"
            fi
            set +a
          '''
        }
      }
    }

    stage('Clean Previous Deployment') {
      steps {
        echo "🧹 Cleaning previous Docker containers and images..."
        sh '''
          docker-compose -f $DOCKER_COMPOSE_FILE down || true
          docker system prune -af || true
        '''
      }
    }

    stage('Build Fresh Docker Images') {
      steps {
        echo "🏗️ Building new Docker images..."
        sh '''
          docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
        '''
      }
    }

    stage('Deploy Containers') {
      steps {
        echo "🚀 Deploying containers..."
        sh '''
          docker-compose -f $DOCKER_COMPOSE_FILE up -d
        '''
      }
    }

    stage('Verify Deployment') {
      steps {
        echo "🧩 Verifying backend and frontend containers..."
        sh '''
          echo "Backend container status:"
          docker ps | grep vele-server || echo "⚠️ Backend not running"
          echo "Frontend container status:"
          docker ps | grep vele-client || echo "⚠️ Frontend not running"
        '''
      }
    }
  }

  post {
    always {
      echo "🧽 Final cleanup of unused Docker resources..."
      sh 'docker system prune -f || true'
    }
    success {
      echo "✅ Deployment completed successfully!"
    }
    failure {
      echo "❌ Deployment failed. Please check logs above."
    }
  }
}
