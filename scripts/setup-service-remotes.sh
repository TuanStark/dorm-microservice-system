#!/bin/bash

# Script to setup individual service repositories
# This keeps the monorepo structure but adds individual remotes for each service

echo "🚀 Setting up individual service repositories..."

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
    echo "📦 Setting up $service..."
    
    # Add remote for each service
    git remote add "$service" "$BASE_REPO_URL-$service.git" || echo "Remote $service already exists"
    
    # Create .gitignore for service-specific files
    cat > "services/$service/.gitignore" << EOF
# Service specific ignores
node_modules/
dist/
coverage/
.env
.env.local
.env.production
*.log
EOF

    echo "✅ $service remote configured"
done

echo "🎉 All service remotes configured!"
echo ""
echo "To push individual services:"
echo "git subtree push --prefix=services/api-gateway api-gateway main"
echo "git subtree push --prefix=services/auth-service auth-service main"
echo ""
echo "To pull individual services:"
echo "git subtree pull --prefix=services/api-gateway api-gateway main"
echo "git subtree pull --prefix=services/auth-service auth-service main"
