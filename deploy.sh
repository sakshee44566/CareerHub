#!/bin/bash

# Career Hub Deployment Script
echo "🚀 Starting Career Hub deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Email Configuration
EMAIL_USER=sakshee907@gmail.com
EMAIL_PASS=your_app_password_here

# Server Configuration
PORT=5000
EOF
    echo "⚠️  Please edit .env file and add your Gmail App Password"
    echo "   Go to Google Account settings > Security > 2-Step Verification > App passwords"
    echo "   Generate an app password and replace 'your_app_password_here' in .env file"
    read -p "Press Enter after updating .env file..."
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo "📊 Admin Panel: http://localhost:3000/admin"
    echo ""
    echo "📧 To configure email:"
    echo "   1. Go to Google Account settings"
    echo "   2. Security > 2-Step Verification > App passwords"
    echo "   3. Generate an app password"
    echo "   4. Update EMAIL_PASS in .env file"
    echo "   5. Restart: docker-compose restart backend"
else
    echo "❌ Deployment failed. Check logs with: docker-compose logs"
fi



