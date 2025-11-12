pipeline {
    agent any
    stages {
        stage('clone Repository') {
            steps {
                echo 'Cloning repository...'
                git url: 'https://github.com/aniketjha348/vele-ci-cd.git'
            }
        }
        stage('Build docker image') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('deploy docker container ') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}



post {
    always {
        echo 'Cleaning.... up unused docker resources'
        sh 'docker system prune -f'
    }
}
