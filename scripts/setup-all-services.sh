#!/bin/bash

# Script to setup all service repositories at once
# This will create individual repositories for each service

echo "🚀 Setting up all service repositories..."

# Array of services
services=(
    "api-gateway"
    "auth-service" 
    "booking-service"
    "building-service"
    "notification-service"
    "payment-service"
    "room-service"
    "upload-service"
    "review-service"
)

# Base repository URL (change this to your Git provider)
BASE_REPO_URL="https://github.com/your-org/dorm-booking"

for service in "${services[@]}"; do
    echo "📦 Setting up $service repository..."
    
    # Create individual repository (you need to do this manually on GitHub/GitLab)
    echo "🔗 Create repository: $BASE_REPO_URL-$service"
    
    # Add remote
    git remote add "$service" "$BASE_REPO_URL-$service.git" 2>/dev/null || echo "Remote $service already exists"
    
    # Push to individual repository
    echo "📤 Pushing $service to its own repository..."
    git subtree push --prefix=services/$service $service main
    
    if [ $? -eq 0 ]; then
        echo "✅ $service repository setup complete"
    else
        echo "❌ Failed to setup $service repository"
    fi
    
    echo ""
done

echo "🎉 All service repositories setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create repositories on GitHub/GitLab for each service"
echo "2. Update BASE_REPO_URL in this script"
echo "3. Run this script again to push to individual repositories"
echo ""
echo "🔧 Individual service management:"
echo "  - Push: ./push-service.sh <service-name>"
echo "  - Pull: ./pull-service.sh <service-name>"
