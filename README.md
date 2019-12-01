# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

⚙ Control
🔓 Entry
🙏 Need
⏳ Time
🌍 Scale

## Claims

| Requirement             | Keywords                            | Importance | Status |
| ----------------------- | ----------------------------------- | ---------- | ------ |
| Event Sourcing          | CQRS, Event-Driven, Commands, Kafka | 🔥         | ⏳     |
| Deployment              | CI, CD, Build Pipeline, Rollback    | 🔥         | ⏳     |
| Test Driven Development | Unit Tests, Integration Tests       | 🔥         | ⏳     |
| Microservices           | Small, Independent                  | 🔥         | ✅     |
| Docker                  | Container                           | 🔥         | ✅     |
| Kubernetes              | Container Orchestration             | 🔥         | ⏳     |
| Encryption              | HTTPs, Hashing, Safety              | 🔥         | ❌     |
| Database(s)             | Storage, Event-Store                | 🔥         | ⏳     |
| File Storage            | Storage                             | 🔥         | ❌     |
| Redux                   | Reactive, Actions, Effects          | 🔥         | ✅     |
| GDPR                    | Legal, Privacy                      | 🔥         | ❌     |
| SEO                     | Marketing                           | 🔥         | ❌     |
| Authentication          | Passwordless                        | 🔥         | ❌     |
| Typescript              | Types                               | 🙂         | ✔️     |
| Node.js                 | Javascript,Best Practices           | 🙂         | ⏳     |
| Local Development       | Nodemon, Docker, VSCode             | 🙂         | ✅     |
| Monorepo                | Lerna, Yarn Workspaces              | 🙂         | ⏳     |
| Monitoring              | Logs, Alarms, Dashboard             | 🙂         | ❌     |
| Git Flow                | Branching, Rebase                   | 🙂         | ⏳     |
| Gateway                 | Discovery, Entry, Auth              | 🙂         | ⏳     |
| Linting                 | Formatting                          | 🌳         | ❌     |
| RxJs                    | Reactive                            | 🌳         | ❌     |
| Cross Platform          | Electron, Nativescript              | 🌳         | ❌     |
| Caching                 | Performance                         | 🌳         | ❌     |
| Logging                 | Debugging                           | 🌳         | ✅     |
| μFrontends              | Composition, Independent            | 🌳         | ❌     |
| Static Pages            | Homepage, Content                   | 🌳         | ❌     |

### Status

✔️ Completely implemented
✅ Implemented in certain parts
⏳ Figuring out how to implement
❌ Not implemented

### Importance

🔥 Highly important
🙂 Moderately important
🌳 Not really important

## Requirements

### Required

- node.js
- docker
- docker-compose
- yarn

### Optional

- microk8s or minikube
- kubectl

### Recommended VSCode Plugins

- [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [Kubernetes](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)
- [Angular template formatter](https://marketplace.visualstudio.com/items?itemName=stringham.angular-template-formatter)

## Setup

### For Development

> Starts all services with `docker-compose` and simoultaniously watches for code changes

```
yarn start:dev
```

> Starts `minikube` for development of container orchestration with Kubernetes

```
minikube start
kubectl apply -f ./kubernetes/common
kubectl apply -f ./kubernetes/minikube

# get ip
minikube ip

# open browser http://<IP>:30001
```

## Testing

```
yarn test
```

## Release new Version

```
lerna version
```

## Deployment

```
not configured yet
```

## Some Useful Commands for Development

```
# open command line of a docker container
docker exec -ti <container> /bin/bash

# fetch docker host ip address
ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1

# stop all docker containers
docker container stop $(docker container ls -aq)

# get microk8s cluster info
microk8s.kubectl cluster-info

# issue an ssl certificate
sudo apt-get install letsencrypt
sudo certbot certonly --manual -d *.drakery.com
# then follow steps

# make file readable without sudo
sudo chown username ./file

# create k8s secret containing ssl certificate and key
kubectl create secret tls tls-secret --key privateKey.pem --cert certificate.pem

# remove all docker images with tag <none>
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)

# get size of docker image (last table row)
docker images
docker images <image-name>
```
