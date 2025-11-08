#!/bin/bash

# Docker Hub Quick Setup Script
# This script helps verify and test your Docker Hub configuration

set -e

echo "🐳 Docker Hub Configuration Checker"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Get username
read -p "Enter your Docker Hub username: " DOCKER_USERNAME
read -sp "Enter your Docker Hub token/password: " DOCKER_TOKEN
echo ""

# Test login
echo ""
echo "Testing Docker Hub login..."
if echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Login successful${NC}"
else
    echo -e "${RED}❌ Login failed - Check username and token${NC}"
    exit 1
fi

# Check repository
REPO_NAME="$DOCKER_USERNAME/unachat"
echo ""
echo "Checking if repository exists: $REPO_NAME"

# Try to pull (if exists)
if docker pull "$REPO_NAME:development" 2>/dev/null; then
    echo -e "${GREEN}✓ Repository exists and is accessible${NC}"
    docker rmi "$REPO_NAME:development" 2>/dev/null
elif docker pull "$REPO_NAME:latest" 2>/dev/null; then
    echo -e "${GREEN}✓ Repository exists (has 'latest' tag)${NC}"
    docker rmi "$REPO_NAME:latest" 2>/dev/null
else
    echo -e "${YELLOW}⚠ Repository doesn't exist yet or is empty${NC}"
    echo "  This is OK - it will be created on first push"
fi

# Build test image
echo ""
echo "Building test image..."
if docker build -t "$REPO_NAME:test" . > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Image built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build image - Check Dockerfile${NC}"
    exit 1
fi

# Test push
echo ""
echo "Testing push to Docker Hub..."
if docker push "$REPO_NAME:test" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Push successful!${NC}"
    echo ""
    echo "🎉 Your Docker Hub configuration is correct!"
    echo ""
    echo "Next steps:"
    echo "1. Go to GitHub: https://github.com/DavElizG/LAB-5-JoseGuadamuz/settings/secrets/actions"
    echo "2. Add secret DOCKERHUB_USERNAME = $DOCKER_USERNAME"
    echo "3. Add secret DOCKERHUB_TOKEN = (your token)"
    echo "4. Update workflow if needed (repository name: $REPO_NAME)"
else
    echo -e "${RED}❌ Push failed${NC}"
    echo ""
    echo "Possible issues:"
    echo "- Repository doesn't exist: Create it at https://hub.docker.com"
    echo "- Token lacks write permissions: Regenerate with Read & Write"
    echo "- Repository is private and token is read-only"
fi

# Cleanup
echo ""
echo "Cleaning up test image..."
docker rmi "$REPO_NAME:test" > /dev/null 2>&1 || true

docker logout > /dev/null 2>&1

echo ""
echo "Done!"
