#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up development environment...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if smtp4dev is already running
if docker ps | grep -q smtp4dev; then
    echo -e "${GREEN}smtp4dev is already running${NC}"
else
    echo "Starting smtp4dev..."
    docker run -d -p 4000:80 -p 2525:25 --name smtp4dev rnwood/smtp4dev
    echo -e "${GREEN}smtp4dev started successfully${NC}"
fi

# Create or update .env file with development settings
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
NODE_ENV=development
EMAIL_PROVIDER=dev-smtp
DEV_SMTP_HOST=localhost
DEV_SMTP_PORT=2525
EOL
    echo -e "${GREEN}.env file created with development settings${NC}"
else
    echo "Updating .env file with development settings..."
    # Add or update development settings in existing .env file
    grep -q "NODE_ENV=" .env || echo "NODE_ENV=development" >> .env
    grep -q "EMAIL_PROVIDER=" .env || echo "EMAIL_PROVIDER=dev-smtp" >> .env
    grep -q "DEV_SMTP_HOST=" .env || echo "DEV_SMTP_HOST=localhost" >> .env
    grep -q "DEV_SMTP_PORT=" .env || echo "DEV_SMTP_PORT=2525" >> .env
    echo -e "${GREEN}.env file updated with development settings${NC}"
fi

# Install nodemailer if not already installed
if ! grep -q "nodemailer" package.json; then
    echo "Installing nodemailer..."
    npm install nodemailer
    echo -e "${GREEN}nodemailer installed successfully${NC}"
fi

echo -e "\n${GREEN}Development environment setup complete!${NC}"
echo -e "\nYou can now:"
echo -e "1. Access smtp4dev UI at ${BLUE}http://localhost:4000${NC}"
echo -e "2. Run your application with ${BLUE}npm run dev${NC}"
echo -e "3. All emails will be captured by smtp4dev and can be viewed in the web interface" 