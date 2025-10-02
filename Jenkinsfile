pipeline {
    agent any

    environment {
        REGISTRY = "sherryobuhuma"
        FRONTEND_IMAGE = "react-frontend"
        BACKEND_IMAGE = "flask-backend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/SherryObuhuma/Cloud-Native-Task-Manager-Flask-React-MongoDB-.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $REGISTRY/$FRONTEND_IMAGE:latest .'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t $REGISTRY/$BACKEND_IMAGE:latest .'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    
                    sh 'docker run --rm $REGISTRY/$BACKEND_IMAGE:latest pytest || true'
                }
            }
        }

        stage('Login to Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh 'docker push $REGISTRY/$FRONTEND_IMAGE:latest'
                sh 'docker push $REGISTRY/$BACKEND_IMAGE:latest'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker network create flasknet || true
                docker rm -f flask-backend react-frontend || true
                docker run -d --name flask-backend --network flasknet -p 5001:5001 $REGISTRY/$BACKEND_IMAGE:latest
                docker run -d --name react-frontend --network flasknet -p 3000:80 $REGISTRY/$FRONTEND_IMAGE:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker images'
        }
    }
}
