pipeline {
    agent any

    tools {
        nodejs 'Node 24.1.0'
    }

    environment {
        projectName = "project34-frontend"
        deployFolder = "/deploy-folder"
        distFolder = "dist"
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/taeyang02/fe-restaurant.git',
                    branch: 'develop',
                    credentialsId: '4'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Copy dist to deploy-folder') {
            steps {
                sh """
                    mkdir -p ${deployFolder}/${projectName}
                    cp -r ${distFolder}/* ${deployFolder}/${projectName}/
                    rm -rf ${distFolder}
                """
            }
        }

        stage('Run Docker Compose') {
            steps {
                sh """
                    cd ${deployFolder}/${projectName}
                    docker compose down || true
                    docker compose up -d --build
                """
            }
        }
    }

    post {
        success {
            echo '✅ Frontend build succeeded!'
        }
        failure {
            echo '❌ Frontend build failed!'
        }
    }
}
