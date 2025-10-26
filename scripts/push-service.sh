#!/bin/bash

# Script to push individual service to its own repository
# Usage: ./push-service.sh <service-name> <branch>

if [ $# -eq 0 ]; then
    echo "❌ Usage: ./push-service.sh <service-name> [branch]"
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

echo "🚀 Pushing $SERVICE_NAME to remote repository..."

# Check if service directory exists
if [ ! -d "services/$SERVICE_NAME" ]; then
    echo "❌ Service $SERVICE_NAME not found in services/ directory"
    exit 1
fi

# Push using git subtree
echo "📤 Pushing $SERVICE_NAME to $SERVICE_NAME remote..."
git subtree push --prefix=services/$SERVICE_NAME $SERVICE_NAME $BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed $SERVICE_NAME to remote repository"
    echo "🔗 Repository URL: https://github.com/your-org/dorm-booking-$SERVICE_NAME"
else
    echo "❌ Failed to push $SERVICE_NAME"
    exit 1
fi
