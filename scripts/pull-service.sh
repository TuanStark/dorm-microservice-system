#!/bin/bash

# Script to pull individual service from its own repository
# Usage: ./pull-service.sh <service-name> <branch>

if [ $# -eq 0 ]; then
    echo "❌ Usage: ./pull-service.sh <service-name> [branch]"
    echo "Available services:"
    echo "  - api-gateway"
    echo "  - auth-service"
    echo "  - booking-service"
    echo "  - building-service"
    echo "  - notification-service"
    echo "  - payment-service"
    echo "  - room-service"
    echo "  - upload-service"
    echo "  - review-service"
    exit 1
fi

SERVICE_NAME=$1
BRANCH=${2:-main}

echo "📥 Pulling $SERVICE_NAME from remote repository..."

# Check if service directory exists
if [ ! -d "services/$SERVICE_NAME" ]; then
    echo "❌ Service $SERVICE_NAME not found in services/ directory"
    exit 1
fi

# Pull using git subtree
echo "📥 Pulling $SERVICE_NAME from $SERVICE_NAME remote..."
git subtree pull --prefix=services/$SERVICE_NAME $SERVICE_NAME $BRANCH --squash

if [ $? -eq 0 ]; then
    echo "✅ Successfully pulled $SERVICE_NAME from remote repository"
else
    echo "❌ Failed to pull $SERVICE_NAME"
    exit 1
fi
