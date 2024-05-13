pipeline {
    agent any

    environment {
        // Securely store GitHub credentials
        GITHUB_TOKEN = credentials('github-token-id')
        GITHUB_REPO = 'accounting_users_be'
        GITHUB_USER = 'github-username'
    }

    stages {
        stage('Setup Environment') {
            // Determine the environment based on the branch and load respective variables
            steps {
                script {
                    if (env.GIT_BRANCH == 'origin/develop') {
                        loadEnv('dev')
                    } else if (env.GIT_BRANCH == 'origin/main') {
                        loadEnv('prod')
                    }
                }
            }
        }

        stage('Build and Deploy') {
            // Post GitHub status, build and deploy using Docker
            steps {
                script {
                    sh "curl -H 'Authorization: token ${GITHUB_TOKEN}' " +
                       "-d '{\"state\": \"pending\", \"description\": \"Build in progress\", " +
                       "\"context\": \"continuous-integration/jenkins\"}' " +
                       "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/statuses/${env.GIT_COMMIT}"
                    try {
                        // Build the Docker container using environment-specific Dockerfiles
                        if (env.agentLabel == 'dev') {
                            sh "docker build -f Dockerfile -t strapi-app:develop ."
                        } else {
                            sh "docker build -f Dockerfile.prod -t strapi-app:production ."
                        }

                        // Run the Docker container
                        sh "docker run --name strapi-app-${env.agentLabel} -d -p 1337:1337 strapi-app:${env.agentLabel}"

                        sh "curl -H 'Authorization: token ${GITHUB_TOKEN}' " +
                           "-d '{\"state\": \"success\", \"description\": \"Build successful\", " +
                           "\"context\": \"continuous-integration/jenkins\"}' " +
                           "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/statuses/${env.GIT_COMMIT}"
                    } catch (Exception e) {
                        sh "curl -H 'Authorization: token ${GITHUB_TOKEN}' " +
                           "-d '{\"state\": \"failure\", \"description\": \"Build failed\", " +
                           "\"context\": \"continuous-integration/jenkins\"}' " +
                           "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/statuses/${env.GIT_COMMIT}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
    }
}

// Function to load environment variables from Jenkins credentials
def loadEnv(String envType) {
    withCredentials([
        string(credentialsId: 'host-id', variable: 'HOST'),
        string(credentialsId: 'port-id', variable: 'PORT'),
        string(credentialsId: 'app-keys-id', variable: 'APP_KEYS'),
        string(credentialsId: 'admin-jwt-secret-id', variable: 'ADMIN_JWT_SECRET'),
        string(credentialsId: 'transfer-token-salt-id', variable: 'TRANSFER_TOKEN_SALT'),
        string(credentialsId: 'database-client-id', variable: 'DATABASE_CLIENT'),
        string(credentialsId: 'database-host-id', variable: 'DATABASE_HOST'),
        string(credentialsId: 'database-port-id', variable: 'DATABASE_PORT'),
        string(credentialsId: 'database-name-id', variable: 'DATABASE_NAME'),
        string(credentialsId: 'database-username-id', variable: 'DATABASE_USERNAME'),
        string(credentialsId: 'database-password-id', variable: 'DATABASE_PASSWORD'),
        string(credentialsId: 'database-ssl-id', variable: 'DATABASE_SSL'),
        string(credentialsId: 'jwt-secret-id', variable: 'JWT_SECRET')
        // More credentials can be added here
    ]) {
        env.agentLabel = envType // Setting environment label for use in docker commands
        // Load .env file which contains only keys and assign credentials to them
        sh """
            set -a
            . ./.env.$envType
            set +a
        """
    }
}
