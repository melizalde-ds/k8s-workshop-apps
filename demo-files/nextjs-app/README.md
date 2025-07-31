# Next.js Kubernetes Dashboard - Deployment Guide

This guide will help you deploy a Next.js application with a real-time Kubernetes dashboard to a local Kubernetes cluster using Minikube.

## Prerequisites

```
- [Docker](https://docs.docker.com/get-docker/) installed
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
```

## Quick Start

### 1. Start Minikube

```bash
minikube start
```

### 2. Verify cluster is running

```bash
kubectl get nodes
```

### 3. Deploy to Kubernetes

Use the provided `deployment.yaml` file to deploy the Next.js dashboard.

```bash
kubectl apply -f deployment.yaml
```

### 4. Verify deployment

```bash
# Check if pods are running
kubectl get pods

# Check deployment status
kubectl get deployments

# Check service
kubectl get services

# Check if health checks pass
kubectl describe pods
```

### 5. Access the application

Since we're using Minikube, expose the service:

```bash
# Option 1: Port forwarding (recommended for testing)
kubectl port-forward service/nextjs-k8s-service 8080:80
```

Now access your dashboard at: `http://localhost:8080`

```bash
# Option 2: Minikube service (opens in browser)
minikube service nextjs-k8s-service
```

## Optional: Horizontal Pod Autoscaler (HPA)

To enable automatic scaling based on CPU usage:

### 1. Enable metrics server in Minikube

```bash
minikube addons enable metrics-server
```

### 2. Create HPA configuration

Use the provided `hpa.yaml` file to create a Horizontal Pod Autoscaler.

### 3. Apply HPA

```bash
kubectl apply -f hpa.yaml
```

### 4. Monitor HPA and test scaling

```bash
# Check HPA status
kubectl get hpa nextjs-k8s-hpa --watch

# Generate CPU load to trigger scaling
kubectl apply -f load-test.yaml

# Watch pods scale up
kubectl get pods --watch
```

### 5. Clean up load test

```bash
kubectl delete pod load-generator
```

## Dashboard Features

The application provides a real-time dashboard showing:

- **Pod Health Status** - Visual indicator of pod health
- **Pod Hostname** - Shows which specific pod is responding (changes as you refresh during scaling)
- **Environment** - Shows production/development mode
- **Version** - Application version
- **Real-time Health Checks** - Updates every 3 seconds

## Testing the Application

### Health Check

```bash
# API health endpoint
curl http://localhost:8080/api/health

# Pod info endpoint
curl http://localhost:8080/api/info

# CPU-intensive endpoint (triggers HPA scaling)
curl http://localhost:8080/api/cpu-work
```

### Load Testing for HPA

```bash
# Method 1: Use the provided load-test pod
kubectl apply -f load-test.yaml

# Method 2: Manual load generation
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh
# Inside the pod, run:
while true; do wget -q -O- http://nextjs-k8s-service/api/cpu-work; done

# Method 3: Multiple concurrent requests
for i in {1..5}; do
  kubectl run load-generator-$i --image=busybox --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://nextjs-k8s-service/api/cpu-work; sleep 0.1; done" &
done
```

## Useful Commands

### Viewing logs

```bash
# View logs from all pods
kubectl logs -l app=nextjs-k8s-app

# View logs from a specific pod
kubectl logs <pod-name>

# Follow logs in real-time
kubectl logs -f -l app=nextjs-k8s-app
```

### Monitoring pod behavior

```bash
# Watch pods scale in real-time
kubectl get pods -l app=nextjs-k8s-app --watch

# Check HPA metrics
kubectl describe hpa nextjs-k8s-hpa

# View pod resource usage
kubectl top pods
```

### Scaling manually

```bash
# Scale to 5 replicas
kubectl scale deployment nextjs-k8s-app --replicas=5

# Check scaling status
kubectl get deployments

# Reset to 2 replicas
kubectl scale deployment nextjs-k8s-app --replicas=2
```

### Debugging

```bash
# Describe deployment
kubectl describe deployment nextjs-k8s-app

# Describe a pod
kubectl describe pod <pod-name>

# Get detailed info about the service
kubectl describe service nextjs-k8s-service

# Check events for troubleshooting
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Cleanup

```bash
# Delete HPA (if created)
kubectl delete -f hpa.yaml

# Delete any load test pods
kubectl delete pod -l app=load-generator

# Delete deployment and service
kubectl delete -f deployment.yaml

# Stop Minikube
minikube stop

# Delete Minikube cluster (optional)
minikube delete
```

## Health Check Configuration

The deployment includes both **liveness** and **readiness** probes that use the `/api/health` endpoint:

- **Liveness Probe**: Checks if the container is still running. If it fails, Kubernetes will restart the pod.
- **Readiness Probe**: Checks if the container is ready to receive traffic. If it fails, the pod is removed from service endpoints.

Both probes use the `/api/health` endpoint which returns a JSON status.

## Troubleshooting

### Dashboard not loading?

```bash
# Check if pods are ready
kubectl get pods -l app=nextjs-k8s-app

# Check service endpoints
kubectl get endpoints nextjs-k8s-service

# Test direct pod access
kubectl port-forward <pod-name> 3000:3000
curl http://localhost:3000/api/health
```

### Health checks failing?

```bash
# Check if the /api/health endpoint is responding
kubectl port-forward <pod-name> 3000:3000
curl http://localhost:3000/api/health

# Check probe configuration
kubectl describe pod <pod-name> | grep -A 10 "Liveness\|Readiness"
```

### HPA not scaling?

```bash
# Check if metrics server is running
kubectl get pods -n kube-system | grep metrics-server

# Verify HPA can read metrics
kubectl describe hpa nextjs-k8s-hpa

# Check pod resource usage
kubectl top pods
```

### Image pull issues?

Make sure the Docker image is public on Docker Hub and the image name in `deployment.yaml` matches exactly.

## Architecture Overview

- **Deployment**: Manages replica pods running the Next.js application with health checks
- **Service**: Exposes the deployment internally within the cluster
- **Health Probes**: Monitor application health using the `/api/health` endpoint
- **HPA** (optional): Automatically scales pods based on CPU utilization
- **Dashboard**: Real-time visualization of pod status and Kubernetes behavior
- **Minikube**: Provides the local Kubernetes cluster

## API Endpoints

- `GET /` - Main dashboard interface
- `GET /api/health` - Health check endpoint (returns JSON status)
- `GET /api/info` - Pod information (hostname, version, environment)
- `GET /api/cpu-work` - CPU-intensive endpoint for load testing

## Next Steps

- Modify resource limits based on your needs
- Experiment with different HPA metrics and thresholds
- Add persistent storage for stateful applications
- Explore ingress controllers for external access
- Try rolling updates by changing the image version
- Add monitoring with Prometheus and Grafana
