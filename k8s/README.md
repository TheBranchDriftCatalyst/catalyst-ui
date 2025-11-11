# Catalyst UI - Kubernetes Deployment

This directory contains Kubernetes manifests for deploying Catalyst UI to a Kubernetes cluster.

## Architecture

- **Namespace**: `catalyst`
- **Deployment**: 2 replicas with rolling updates
- **Service**: ClusterIP on port 80
- **Ingress**: Traefik IngressRoute at `catalyst.talos00`

## Manual Deployment

```bash
# Apply all manifests
kubectl apply -k k8s/

# Or individually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingressroute.yaml
```

## ArgoCD Deployment

This application is designed to be deployed via ArgoCD for GitOps workflow:

1. ArgoCD watches the `main` branch of this repository
2. Changes to `k8s/` directory trigger automatic syncs
3. Access the application at: http://catalyst.talos00

## Building the Docker Image

```bash
# Build the image
docker build -t catalyst-ui:latest .

# For local registry (e.g., kind cluster)
docker build -t localhost:5000/catalyst-ui:latest .
docker push localhost:5000/catalyst-ui:latest
```

## Development

The Dockerfile uses a multi-stage build:

1. **Builder stage**: Installs dependencies and builds the Vite app
2. **Production stage**: Nginx serves the static files

## Configuration

The deployment uses:

- **Resources**: 50m CPU / 64Mi RAM (requests), 200m CPU / 128Mi RAM (limits)
- **Security**: Non-root user (UID 101), dropped capabilities
- **Health checks**: Liveness and readiness probes on `/`
