# k8s-workshop-apps

A collection of containerized applications and Kubernetes manifests for hands-on learning and workshops. Deploy, scale, and orchestrate modern apps with K8s! 🚀

## 🎯 Workshop Overview

This repository contains two real-world applications designed to teach Kubernetes fundamentals through practical deployment and scaling exercises. Perfect for CS clubs, bootcamps, and learning events.

**"Deploy Real Apps Like Netflix Does"** - Learn the same container orchestration techniques used by major tech companies.

## 📦 Applications

### 🦀 Rust ML Inference API

A high-performance machine learning inference API built in Rust that predicts handwritten digits using MNIST.

**Features:**

- ONNX model inference for digit recognition (28×28 pixel input)
- Health check endpoints (`/healthz`)
- Optimized for production workloads
- Perfect for demonstrating ML model deployment
- Automatic scaling based on CPU and memory usage

**Docker Hub:** `elizaldecruzm/rust-ml-inference-api:latest`

### ⚛️ Next.js Kubernetes Dashboard

An interactive web application that visualizes Kubernetes cluster behavior in real-time.

**Features:**

- Real-time pod health monitoring
- Visual scaling demonstration
- Hostname display shows load balancing in action
- CPU load generation for HPA testing
- Beautiful, responsive UI that updates every 3 seconds
- Environment and version information display

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
# Get ML API URL
minikube service rust-ml-api-service --url

# Get Dashboard URL
minikube service nextjs-k8s-service --url
```

Both commands will return URLs like:

- **ML API:** `http://127.0.0.1:30081`
- **Dashboard:** `http://127.0.0.1:30080`

Click the URLs or copy them to your browser!

### 4. Test the Applications

**Dashboard:**

- Visit the dashboard URL to see real-time pod information
- Refresh to see load balancing between different pods
- Watch the health status update automatically

**ML API:**

```bash
# Health check
curl <ml-api-url>/healthz

# Predict a digit (28x28 = 784 values)
curl -X POST <ml-api-url>/predict \
  -H "Content-Type: application/json" \
  -d '{"values": [0.0, 0.0, ..., 1.0]}' # 784 total values
```

## 🗂️ Repository Structure

```
k8s-workshop-apps/
├── README.md                           # This file
├── demo-files/                         # Ready-to-deploy K8s manifests
│   ├── nextjs-app/
│   │   ├── README.md                   # Next.js deployment guide
│   │   ├── deployment.yaml             # Deployment + NodePort Service
│   │   ├── hpa.yaml                    # Horizontal Pod Autoscaler
│   │   └── load-test.yaml              # Load generation pod
│   └── rust-ml-inference-api/
│       ├── README.md                   # Rust API deployment guide
│       ├── deployment.yaml             # Deployment + NodePort Service
│       └── hpa.yaml                    # Horizontal Pod Autoscaler
└── nextjs-app/                         # Next.js source code
    ├── Dockerfile                      # Container build instructions
    ├── README.Docker.md                # Docker build guide
    ├── README.md                       # Application README
    ├── app/                            # Next.js app directory
    │   ├── api/                        # API routes
    │   │   ├── health/                 # Health check endpoint
    │   │   ├── info/                   # Pod info endpoint
    │   │   └── cpu-work/               # CPU load endpoint for HPA
    │   ├── globals.css                 # Global styles
    │   ├── layout.tsx                  # Root layout
    │   └── page.tsx                    # Main dashboard page
    ├── package.json                    # Dependencies
    ├── tsconfig.json                   # TypeScript config
    └── [other Next.js files...]
```

## 🎓 Learning Objectives

By completing this workshop, participants will understand:

- **Container Orchestration**: How Kubernetes manages containerized applications at scale
- **Self-Healing**: Automatic recovery from failures and pod restarts
- **Horizontal Scaling**: Adding/removing replicas based on CPU and memory demand
- **Load Balancing**: Distributing traffic across multiple pods automatically
- **Health Checks**: Monitoring application health with liveness and readiness probes
- **Real-world Deployment**: Production-ready configurations and best practices
- **Service Discovery**: How pods communicate within the cluster
- **Resource Management**: Setting CPU/memory requests and limits

## 🛠️ Key Kubernetes Concepts Demonstrated

- **Pods**: Smallest deployable units containing your applications
- **Deployments**: Declarative application management and rolling updates
- **Services**: Network abstraction, discovery, and load balancing (NodePort)
- **HPA**: Automatic scaling based on CPU/memory metrics
- **Health Probes**: Liveness and readiness checks for reliability
- **Resource Management**: CPU/memory requests and limits for efficiency
- **ConfigMaps**: Environment variables and configuration management

## 🔧 Useful Commands

### Cluster Management

```bash
kubectl get nodes                        # Check cluster status
kubectl get pods --all-namespaces       # See all running pods
minikube status                          # Verify Minikube is running
```

### Application Monitoring

```bash
kubectl get pods -l app=nextjs-k8s-app --watch     # Watch Next.js pods
kubectl get pods -l app=rust-ml-api --watch        # Watch ML API pods
kubectl get hpa --watch                            # Watch autoscaling
kubectl top pods                                   # Resource usage
```

### Debugging and Logs

```bash
kubectl describe pod <pod-name>                    # Detailed pod info
kubectl logs <pod-name>                           # View application logs
kubectl logs -f -l app=nextjs-k8s-app            # Follow logs
kubectl get events --sort-by=.metadata.creationTimestamp  # Recent events
```

### Scaling and Testing

```bash
# Manual scaling
kubectl scale deployment nextjs-k8s-app --replicas=5
kubectl scale deployment rust-ml-api --replicas=3

# Generate load for HPA testing
kubectl apply -f demo-files/nextjs-app/load-test.yaml
kubectl delete pod load-generator

# Service access
minikube service nextjs-k8s-service --url
minikube service rust-ml-api-service --url
```

### Cleanup

```bash
kubectl delete -f demo-files/rust-ml-inference-api/
kubectl delete -f demo-files/nextjs-app/
minikube stop
minikube delete  # Complete cleanup
```

## 🌟 Why These Applications?

- **Rust ML API**: Demonstrates high-performance, resource-efficient microservices used in ML production
- **Next.js Dashboard**: Provides visual feedback making abstract Kubernetes concepts tangible
- **Real-world Relevance**: Both represent actual production patterns used by major companies
- **Interactive Learning**: Students see immediate results of their scaling and deployment actions
- **Cross-Platform**: Works consistently on Windows, macOS, and Linux
- **Workshop-Optimized**: Uses NodePort services for reliable, simple access across different environments

## 🎯 Workshop Flow Suggestion

1. **Deploy Applications** (10 min): Get both apps running
2. **Explore the Dashboard** (15 min): Understand pod behavior and load balancing
3. **Test ML Predictions** (10 min): Send digit recognition requests
4. **Enable HPA** (15 min): Apply autoscaling configurations
5. **Generate Load** (15 min): Trigger scaling and observe behavior
6. **Experiment** (15 min): Manual scaling, rolling updates, failure recovery

## 🚨 Troubleshooting

### Common Issues

**Pods not starting?**

```bash
kubectl describe pod <pod-name>
kubectl get events
```

**Can't access applications?**

```bash
minikube service <service-name> --url
kubectl get services
```

**HPA not working?**

```bash
kubectl get hpa
minikube addons list | grep metrics-server
```

**Image pull errors?**

```bash
kubectl describe pod <pod-name> | grep -i pull
minikube image ls  # Check if images are cached
```

## 📖 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Tutorials](https://minikube.sigs.k8s.io/docs/tutorials/)
- [Container Best Practices](https://cloud.google.com/architecture/best-practices-for-building-containers)
- [Kubernetes Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 🤝 Contributing

Workshop feedback and improvements welcome!

- Found a bug? Open an issue
- Have an improvement? Submit a PR
- Want to add another demo app? Let's discuss!

## 📝 License

MIT License - Feel free to use for educational purposes.

---

**Ready to deploy like Netflix? Let's container-ize! 🐳⚡**
