# k8s-workshop-apps

A collection of containerized applications and Kubernetes manifests for hands-on learning and workshops. Deploy, scale, and orchestrate modern apps with K8s! 🚀

## 🎯 Workshop Overview

This repository contains two real-world applications designed to teach Kubernetes fundamentals through practical deployment and scaling exercises. Perfect for CS clubs, bootcamps, and learning events.

**"Deploy Real Apps Like Netflix Does"** - Learn the same container orchestration techniques used by major tech companies.

## 📦 Applications

### 🦀 Rust ML Inference API

A high-performance machine learning inference API built in Rust that predicts handwritten digits using MNIST.

**Features:**

- ONNX model inference for digit recognition
- Health check endpoints
- Optimized for production workloads
- Perfect for demonstrating ML model deployment

**Docker Hub:** `elizaldecruzm/rust-ml-inference-api:latest`

### ⚛️ Next.js Kubernetes Dashboard

An interactive web application that visualizes Kubernetes cluster behavior in real-time.

**Features:**

- Real-time pod health monitoring
- Visual scaling demonstration
- Hostname display shows load balancing
- CPU load generation for HPA testing
- Beautiful, responsive UI

**Docker Hub:** `elizaldecruzm/nextjs-k8s-workshop:latest`

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

### 1. Start Your Cluster

```bash
minikube start
minikube addons enable metrics-server
```

### 2. Deploy Applications

```bash
# Deploy Rust ML API
kubectl apply -f demo-files/rust-ml-inference-api/deployment.yaml
kubectl apply -f demo-files/rust-ml-inference-api/hpa.yaml

# Deploy Next.js Dashboard
kubectl apply -f demo-files/nextjs-app/deployment.yaml
kubectl apply -f demo-files/nextjs-app/hpa.yaml
```

### 3. Access Applications

```bash
# ML API
kubectl port-forward service/rust-ml-api-service 8080:80

# Dashboard (in another terminal)
kubectl port-forward service/nextjs-k8s-service 3000:80
```

Visit:

- **Dashboard:** http://localhost:3000
- **ML API:** http://localhost:8080

## 🗂️ Repository Structure

```
k8s-workshop-apps/
├── README.md                           # This file
├── demo-files/                         # Ready-to-deploy K8s manifests
│   ├── nextjs-app/
│   │   ├── README.md                   # Next.js deployment guide
│   │   ├── deployment.yaml             # Deployment + Service
│   │   ├── hpa.yaml                    # Horizontal Pod Autoscaler
│   │   └── load-test.yaml              # Load generation pod
│   └── rust-ml-inference-api/
│       ├── README.md                   # Rust API deployment guide
│       ├── deployment.yaml             # Deployment + Service
│       └── hpa.yaml                    # Horizontal Pod Autoscaler
└── nextjs-app/                         # Next.js source code
    ├── Dockerfile                      # Container build instructions
    ├── README.Docker.md                # Docker build guide
    ├── README.md                       # Application README
    ├── app/                            # Next.js app directory
    │   ├── api/                        # API routes
    │   │   ├── health/                 # Health check endpoint
    │   │   ├── info/                   # Pod info endpoint
    │   │   └── load/                   # CPU load endpoint
    │   ├── globals.css                 # Global styles
    │   ├── layout.tsx                  # Root layout
    │   └── page.tsx                    # Main dashboard page
    ├── package.json                    # Dependencies
    ├── tsconfig.json                   # TypeScript config
    └── [other Next.js files...]
```

## 🎓 Learning Objectives

By completing this workshop, you'll understand:

- **Container Orchestration**: How Kubernetes manages containerized applications
- **Self-Healing**: Automatic recovery from failures
- **Horizontal Scaling**: Adding/removing replicas based on demand
- **Load Balancing**: Distributing traffic across multiple pods
- **Health Checks**: Monitoring application health
- **Real-world Deployment**: Production-ready configurations

## 🛠️ Key Kubernetes Concepts Demonstrated

- **Pods**: Smallest deployable units
- **Deployments**: Declarative application management
- **Services**: Network abstraction and discovery
- **HPA**: Automatic scaling based on metrics
- **Health Probes**: Liveness and readiness checks
- **Resource Management**: CPU/memory requests and limits

## 🔧 Useful Commands

```bash
# Cluster management
kubectl get nodes
kubectl get pods --all-namespaces

# Application monitoring
kubectl get pods -l app=nextjs-k8s-app --watch
kubectl get hpa --watch
kubectl top pods

# Debugging
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl get events --sort-by=.metadata.creationTimestamp

# Scaling
kubectl scale deployment nextjs-k8s-app --replicas=5
kubectl scale deployment rust-ml-api --replicas=3

# Load testing
kubectl apply -f demo-files/nextjs-app/load-test.yaml
kubectl delete pod load-generator

# Cleanup
kubectl delete -f demo-files/rust-ml-inference-api/
kubectl delete -f demo-files/nextjs-app/
minikube stop
```

## 🌟 Why These Applications?

- **Rust ML API**: Demonstrates high-performance, resource-efficient microservices
- **Next.js Dashboard**: Provides visual feedback making abstract concepts tangible
- **Real-world relevance**: Both represent actual production patterns
- **Interactive learning**: Students see immediate results of their actions

## 📖 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Tutorials](https://minikube.sigs.k8s.io/docs/tutorials/)
- [Container Best Practices](https://cloud.google.com/architecture/best-practices-for-building-containers)

## 🤝 Contributing

Workshop feedback and improvements welcome! Open an issue or submit a PR.

## 📝 License

MIT License - Feel free to use for educational purposes.

---

**Ready to deploy like Netflix? Let's container-ize! 🐳⚡**
