#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Function to print section headers
print_header() {
    echo
    print_color $CYAN "=================================="
    print_color $CYAN "$1"
    print_color $CYAN "=================================="
    echo
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait with countdown
wait_with_countdown() {
    local seconds=$1
    local message=$2

    print_color $YELLOW "$message"
    for ((i=seconds; i>0; i--)); do
        printf "\r${YELLOW}Waiting... ${i} seconds remaining${NC}"
        sleep 1
    done
    printf "\r${GREEN}Wait complete!                    ${NC}\n"
}

print_header "iNethi Monitoring UI Production Setup"

# Check if we're in the correct directory
if [ ! -f "docker-compose.yml" ]; then
    print_color $RED "Error: docker-compose.yml not found!"
    print_color $RED "Please run this script from the root of the monitoring-ui repository."
    exit 1
fi

# Check for required commands
print_color $BLUE "Checking prerequisites..."

if ! command_exists docker; then
    print_color $RED "Error: Docker is not installed or not in PATH"
    print_color $YELLOW "Please install Docker first: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    print_color $RED "Error: Docker Compose is not installed or not in PATH"
    print_color $YELLOW "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

print_color $GREEN "✓ Docker and Docker Compose are available"

# Check Docker permissions
print_color $BLUE "Checking Docker permissions..."

if ! docker ps >/dev/null 2>&1; then
    print_color $RED "Error: Cannot run Docker commands without sudo!"
    echo
    print_color $YELLOW "This usually means your user is not in the 'docker' group."
    print_color $YELLOW "To fix this issue, you have two options:"
    echo
    print_color $CYAN "Option 1 (Recommended): Add your user to the docker group"
    print_color $YELLOW "  1. Run: sudo usermod -aG docker \$USER"
    print_color $YELLOW "  2. Log out and log back in (or restart your session)"
    print_color $YELLOW "  3. Verify with: docker ps"
    echo
    print_color $CYAN "Option 2: Run this script with sudo (not recommended for security reasons)"
    print_color $YELLOW "  sudo ./setup.sh"
    echo
    print_color $BLUE "For detailed instructions, see:"
    print_color $BLUE "https://docs.docker.com/engine/install/linux-postinstall/"
    echo
    print_color $RED "Please fix the Docker permissions issue and run this script again."
    exit 1
fi

print_color $GREEN "✓ Docker permissions are correct"

# Test Docker Compose permissions
if ! (docker-compose version >/dev/null 2>&1 || docker compose version >/dev/null 2>&1); then
    print_color $RED "Error: Cannot run Docker Compose commands!"
    print_color $YELLOW "This might be related to Docker permissions. Please ensure Docker is properly configured."
    print_color $BLUE "See: https://docs.docker.com/engine/install/linux-postinstall/"
    exit 1
fi

print_color $GREEN "✓ Docker Compose permissions are correct"

# Check if .env file exists (for Docker Compose)
if [ ! -f ".env" ]; then
    print_color $YELLOW ".env file not found. Creating from .example..."
    
    if [ -f ".example" ]; then
        cp .example .env
        print_color $GREEN "✓ Created .env from .example"
    else
        print_color $RED "Error: .example file not found!"
        print_color $YELLOW "Creating basic .env file..."
        cat > .env << EOF
# Traefik Configuration (defaults)
TRAEFIK_HOST=monitoring.inethilocal.net
TRAEFIK_ENTRYPOINTS=websecure
TRAEFIK_NETWORK_BRIDGE=inethi-bridge-traefik

# Next.js Configuration
NEXT_PUBLIC_BACKEND=true
NEXT_PUBLIC_API_BASE_URL=https://monitoring-backend.inethilocal.net/api/v1
EOF
        print_color $GREEN "✓ Created basic .env file"
    fi
else
    print_color $GREEN "✓ .env file found"
fi

# Check if .env.local file exists
if [ ! -f ".env.local" ]; then
    print_color $YELLOW ".env.local file not found. Creating from .example..."
    
    if [ -f ".example" ]; then
        cp .example .env.local
        print_color $GREEN "✓ Created .env.local from .example"
    else
        print_color $RED "Error: .example file not found!"
        print_color $YELLOW "Creating basic .env.local file..."
        cat > .env.local << EOF
NEXT_PUBLIC_BACKEND=true
NEXT_PUBLIC_API_BASE_URL=https://monitoring-backend.inethilocal.net/api/v1

# Traefik Configuration
TRAEFIK_HOST=monitoring.inethilocal.net
TRAEFIK_ENTRYPOINTS=websecure
TRAEFIK_NETWORK_BRIDGE=inethi-bridge-traefik
EOF
        print_color $GREEN "✓ Created basic .env.local file"
    fi
else
    print_color $GREEN "✓ .env.local file found"
fi

print_color $GREEN "✓ .env.local file found"

# Display and confirm environment files
print_header "Environment Configuration Review"
print_color $CYAN "About to display your environment file contents..."
print_color $YELLOW "Press Enter to continue and view the environment files..."
read -r

print_color $YELLOW "Current .env file contents (for Docker Compose):"
echo
cat .env
echo

print_color $YELLOW "Current .env.local file contents (for Next.js):"
echo
cat .env.local
echo

read -p "$(print_color $CYAN "Are you happy with the environment configuration? (y/N): ")" -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_color $YELLOW "Please update your environment files and run the script again."
    exit 0
fi

# Basic validation of environment files
print_color $BLUE "Validating environment files..."

# Check .env file (for Docker Compose)
print_color $BLUE "Validating .env file..."
required_vars=("TRAEFIK_HOST" "TRAEFIK_ENTRYPOINTS" "TRAEFIK_NETWORK_BRIDGE")

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env; then
        print_color $RED "Error: Required variable $var not found in .env file"
        exit 1
    fi

    # Check if variable has a value
    value=$(grep "^${var}=" .env | cut -d'=' -f2-)
    if [ -z "$value" ] || [ "$value" = "your_value_here" ] || [ "$value" = "changeme" ]; then
        print_color $RED "Error: Variable $var appears to have a placeholder value in .env file. Please set a real value."
        exit 1
    fi
done

print_color $GREEN "✓ .env file validation passed"

# Check .env.local file (for Next.js)
print_color $BLUE "Validating .env.local file..."
required_vars=("NEXT_PUBLIC_BACKEND" "NEXT_PUBLIC_API_BASE_URL")

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        print_color $RED "Error: Required variable $var not found in .env.local file"
        exit 1
    fi

    # Check if variable has a value
    value=$(grep "^${var}=" .env.local | cut -d'=' -f2-)
    if [ -z "$value" ] || [ "$value" = "your_value_here" ] || [ "$value" = "changeme" ]; then
        print_color $RED "Error: Variable $var appears to have a placeholder value in .env.local file. Please set a real value."
        exit 1
    fi
done

print_color $GREEN "✓ .env.local file validation passed"

# Stop any existing containers
print_header "Stopping Existing Containers"
if docker compose down 2>/dev/null || docker-compose down 2>/dev/null; then
    print_color $GREEN "✓ Stopped any existing containers"
else
    print_color $YELLOW "No existing containers to stop"
fi

# Build the Docker image
print_header "Building Docker Image"
print_color $BLUE "Building the monitoring UI image..."

if docker compose build 2>/dev/null || docker-compose build 2>/dev/null; then
    print_color $GREEN "✓ Docker image built successfully"
else
    print_color $RED "Error: Failed to build Docker image"
    print_color $YELLOW "This might be a permissions issue. If you're getting permission denied errors,"
    print_color $YELLOW "please check: https://docs.docker.com/engine/install/linux-postinstall/"
    exit 1
fi

# Start the UI container
print_header "Starting Monitoring UI"
print_color $BLUE "Starting the monitoring UI container..."

if docker compose up -d 2>/dev/null || docker-compose up -d 2>/dev/null; then
    print_color $GREEN "✓ Monitoring UI started"
else
    print_color $RED "Error: Failed to start Monitoring UI"
    print_color $YELLOW "Check Docker permissions if you're getting permission denied errors:"
    print_color $YELLOW "https://docs.docker.com/engine/install/linux-postinstall/"
    exit 1
fi

wait_with_countdown 15 "Waiting for Monitoring UI to be ready..."

# Check if UI is healthy
print_color $BLUE "Checking Monitoring UI health..."
max_attempts=6
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker logs inethi-monitoring-ui 2>&1 | grep -q "Ready" || \
       docker logs inethi-monitoring-ui 2>&1 | grep -q "started server" || \
       docker logs inethi-monitoring-ui 2>&1 | grep -q "Local:" || \
       docker logs inethi-monitoring-ui 2>&1 | grep -q "Listening on"; then
        print_color $GREEN "✓ Monitoring UI is healthy and ready"
        break
    fi

    if [ $attempt -eq $max_attempts ]; then
        print_color $YELLOW "Warning: Could not confirm Monitoring UI health, but proceeding..."
        print_color $BLUE "You can check the logs with: docker logs inethi-monitoring-ui"
        break
    fi

    print_color $YELLOW "Attempt $attempt/$max_attempts: Monitoring UI not ready yet, waiting..."
    sleep 10
    ((attempt++))
done

# Final status check
print_header "Deployment Status"
print_color $BLUE "Checking container status..."

if docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null; then
    echo
    print_color $GREEN "✓ Container is running!"
    echo
    print_color $CYAN "You can now access:"
    print_color $YELLOW "- Local Access: http://localhost:3000"
    print_color $YELLOW "- Traefik URL: https://$(grep "^TRAEFIK_HOST=" .env | cut -d'=' -f2)"
    echo
    print_color $BLUE "To view logs, use:"
    print_color $YELLOW "  docker compose logs -f ui"
    echo
    print_color $BLUE "To stop the service:"
    print_color $YELLOW "  docker compose down"
    echo
    print_color $BLUE "Useful commands:"
    print_color $YELLOW "  docker compose logs ui        # View UI logs"
    print_color $YELLOW "  docker compose restart ui    # Restart UI service"
    print_color $YELLOW "  docker compose down          # Stop all services"
    echo
else
    print_color $RED "Error: Failed to get container status"
    print_color $YELLOW "This might be a permissions issue. Check:"
    print_color $YELLOW "https://docs.docker.com/engine/install/linux-postinstall/"
    exit 1
fi

print_header "Setup Complete!"
print_color $GREEN "Monitoring UI is now running successfully!"
print_color $GREEN "The container is up and ready to serve the application."
