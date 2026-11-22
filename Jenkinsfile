// Sarthi website pipeline: unit tests -> build -> UI tests in the separate sarthi-automation repo.
// Setup guide: sarthi-automation/docs/CI_SETUP.md
pipeline {
    agent any

    environment {
        CI = 'true'
        // Name of the Jenkins job for the sarthi-automation repo (multibranch job / branch)
        AUTOMATION_JOB = 'sarthi-automation/main'
    }

    options {
        timeout(time: 40, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install') {
            steps { script { runCmd 'npm ci --no-audit --no-fund' } }
        }

        stage('Unit tests') {
            parallel {
                stage('Python pipeline') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                  python3 -m venv .venv
                                  .venv/bin/pip install -q -r ai/requirements-ci.txt
                                  .venv/bin/python -m unittest discover -s ai/tests -v
                                '''
                            } else {
                                bat '''
                                  python -m venv .venv
                                  .venv\\Scripts\\pip install -q -r ai\\requirements-ci.txt
                                  .venv\\Scripts\\python -m unittest discover -s ai\\tests -v
                                '''
                            }
                        }
                    }
                }
                stage('Scheme data') {
                    steps { script { runCmd 'node src/features/explore/data.test.ts' } }
                }
                stage('Search engine') {
                    steps { script { runCmd 'node src/features/explore/search.test.ts' } }
                }
                stage('Backend') {
                    steps {
                        dir('backend') {
                            script {
                                runCmd 'npm ci --no-audit --no-fund'
                                runCmd 'npm test'
                            }
                        }
                    }
                }
                stage('TypeScript') {
                    steps { script { runCmd 'npx tsc --noEmit -p .' } }
                }
            }
        }

        stage('Build') {
            steps { script { runCmd 'npm run build' } }
        }

        stage('UI tests (sarthi-automation)') {
            steps {
                script {
                    // PR builds: test the PR's head commit (it exists on GitHub; Jenkins' local
                    // merge commit does not). Branch builds: test this exact commit.
                    def appRef = env.CHANGE_ID ? "refs/remotes/origin/pr/${env.CHANGE_ID}" : env.GIT_COMMIT
                    def suite = env.CHANGE_ID ? 'testng-smoke.xml' : 'testng.xml'
                    def run = build(job: env.AUTOMATION_JOB, wait: true, propagate: false, parameters: [
                        string(name: 'APP_REF', value: appRef),
                        string(name: 'BASE_URL', value: ''),
                        string(name: 'SUITE', value: suite),
                        string(name: 'BROWSER', value: 'chrome'),
                    ])
                    echo "UI tests: ${run.result} -> ${run.absoluteUrl}"
                    if (run.result != 'SUCCESS') {
                        error("UI tests failed. Report: ${run.absoluteUrl}")
                    }
                }
            }
        }
    }
}

/** Runs a command on Linux (sh) or Windows (bat) agents. */
def runCmd(String cmd) {
    if (isUnix()) {
        sh cmd
    } else {
        bat cmd
    }
}
