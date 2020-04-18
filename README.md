# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

# Description

This is a project with the purpose of learning the architecture of complex web applications. The main goals can be seen in the table below. CENTS Ideas is going to be a website to share, review and discover business ideas. The concept of CENTS (⚙ Control 🔓 Entry 🙏 Need ⏳ Time 🌍 Scale) was initially introduced by [MJ DeMarco](http://www.mjdemarco.com/).

# Goals

| Requirement                                    | Keywords                                 | Status |
| ---------------------------------------------- | ---------------------------------------- | ------ |
| Microservices                                  | small services, docker                   | ✔️     |
| Redux frontend                                 | reactive, actions, effects               | ✔️     |
| Monorepo                                       | all packages and services in one repo    | ✔️     |
| Typescript                                     | types everywhere!                        | ✔️     |
| Local development                              | hot reload, docker-compose, vscode       | ✔️     |
| Git flow                                       | branching, releases, rebasing            | ✔️     |
| Gateway                                        | discovery, entry point, auth             | ✔️     |
| Authentication                                 | passwordless, google login               | ✔️     |
| Progressive Web App                            | pwa, service worker, mobile-friendly     | ✔️     |
| [Event sourcing](https://youtu.be/GzrZworHpIk) | event-driven, commands, message broker   | ✅     |
| Deployment                                     | ci, cd, build automation, bazel          | ✅     |
| Testing                                        | unit Tests, integration Tests            | ✅     |
| Kubernetes                                     | container orchestration                  | ✅     |
| Database(s)                                    | data storage, event store, backups       | ✅     |
| Search Engine Optimization                     | server side rendering, marketing, google | ✅     |
| Frontend                                       | code splitting, 100% lighthouse score    | ✅     |
| Security                                       | encryption, https                        | ✅     |
| File storage                                   | blob storage, encrypted, access control  | ❌     |
| Static pages                                   | homepage, static content                 | ❌     |
| Search                                         | indexing, realtime search                | ❌     |
| Admin panel                                    | monitoring, event handling, logs         | ❌     |
| Backups                                        | automatic, manual, restore               | ❌     |
| Realtime                                       | some kind of realtime integration        | ❌     |
| General Data Protection Regulation             | legal, privacy, gdpr, eu law             | ❌     |
| User Interface                                 | modern, drag&drop, touch gestures        | ❌     |
| Compute server                                 | non-nodejs server for high cpu tasks     | ❌     |
| Push notifications                             | mobile and desktop                       | ❌     |
| Payments                                       | payout, credit card, paypal              | ❌     |
| Message Queue                                  | batching, scheduled tasks                | ❌     |
| Multi-Language                                 | change language, easily add more         | ❌     |
| Trusted Web Activity                           | twa, publish app on play store           | ❌     |

✔️ Completely implemented
✅ Partly implemented
❌ Not yet implemented

# Development

## Commands

- `yarn` to install all necessary dependencies for local development
- `yarn dev` to start all backend services locally (gateway is available under http://localhost:3000)
- `yarn client:dev` to start the frontend application (live at http://localhost:5432)
- `yarn test` to run all unit tests
- `yarn client:prod` to start the frontend application with server side rendering (http://localhost:4000)
- `yarn clean` to clear node_modules, Bazel and Docker
- `yarn lint` to detect linting problems
- `yarn up` to find node module updates

## Setup on Ubuntu

> Currently Ubuntu is the only OS where everything was tested

**Required**

```bash
# install git, nodejs, docker-compose
sudo apt update && \
sudo apt install git nodejs docker-compose -y && \

# install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn

# install bazel
sudo yarn global add @bazel/buildifier --prefix /usr/local && \
sudo yarn global add @bazel/bazelisk --prefix /usr/local
```

**Optional**

```bash
# install vscode, chromium, kubectl, helm
sudo snap install chromium --classic && \
sudo snap install code --classic && \
sudo snap install kubectl --classic && \
sudo snap install helm --classic

# gcloud
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt-get update && sudo apt-get install google-cloud-sdk
gcloud init
gcloud auth configure-docker

# angular cli
sudo yarn global add @angular/cli --prefix /usr/local
```

## Git Flow

**Read [this](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for more detail**

**Creating a feature branch**

```
git checkout dev
git checkout -b <name-of-feature-branch>
```

**Finishing a feature branch**

```
git checkout dev
git merge <name-of-feature-branch>
```

**Release branches**

```
git checkout dev
git checkout -b release/0.1.0
# release work
git checkout master
git merge release/0.1.0
```

**Hotfix branches**

```
git checkout master
git checkout -b <name-of-hotfix-branch>
git checkout master
git merge <name-of-hotfix-branch>
git checkout dev
git merge <name-of-hotfix-branch>
git branch -D <name-of-hotfix-branch>
```

# Deployment

_TODO consider creating script to automate this_

### 1. Create [GKE](https://cloud.google.com/kubernetes-engine) cluster and connect to it

```bash
gcloud beta container --project "centsideas" clusters create "centsideas" --zone "europe-west3-b" --no-enable-basic-auth --machine-type "n1-standard-1" --disk-size "10"
gcloud container clusters get-credentials centsideas --zone europe-west3-b --project centsideas
```

_TODO add instructions on how to add Application-layer Secrets Encryption_

### 2. Setup [Helm](https://helm.sh/)

```bash
helm repo add stable https://kubernetes-charts.storage.googleapis.com/ && \
helm repo add jetstack https://charts.jetstack.io/ && \
helm repo update
```

### 3. Create an [NGINX Ingress](https://github.com/kubernetes/ingress-nginx)

```bash
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account) && \
helm install nginx-ingress stable/nginx-ingress
```

### 4. Point Domain to IP

Go to the created [Load Balancer](https://console.cloud.google.com/net-services/loadbalancing/loadBalancers/list) and point your domain to this IP address via an "A" record.

| Record Type | Domain             | Value           |
| ----------- | ------------------ | --------------- |
| A           | centsideas.com     | your IP address |
| A           | api.centsideas.com | your IP address |

### 5. Setup [Cert Manager](https://github.com/helm/charts/tree/master/stable/cert-manager)

```
kubectl apply --validate=false -f https://raw.githubusercontent.com/jetstack/cert-manager/v0.13.0/deploy/manifests/00-crds.yaml && \
kubectl create namespace cert-manager && \
helm install cert-manager jetstack/cert-manager --namespace cert-manager
```

### 6. Deploy services

```
yarn deploy
```

Wait until all Workloads are up and running. Now you should be able to visit https://centsideas.com

## Special thanks to:

[@rayman1104](https://github.com/rayman1104)

[@marcus-sa](https://github.com/marcus-sa)
