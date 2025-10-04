#!/bin/bash

# UVZ Course Launchpad AI - Whop Deployment Script

echo "🚀 Deploying UVZ Course Launchpad AI to Whop..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p whop-deploy
cp -r dist/* whop-deploy/
cp whop.config.js whop-deploy/
cp package.json whop-deploy/
cp README.md whop-deploy/

# Create Whop app manifest
cat > whop-deploy/manifest.json << EOF
{
  "appId": "app_1CSGwlh2Of6r50",
  "name": "UVZ Course Launchpad AI",
  "description": "Automate the entire digital product creation and listing process on Whop, starting from a user's Unique Value Zone (UVZ), with no required human content creation.",
  "version": "1.0.0",
  "author": "UVZ Course Launchpad AI",
  "category": "Education",
  "tags": ["ai", "course-creation", "digital-products", "uvz", "automation"],
  "permissions": [
    "courses:create",
    "courses:read", 
    "courses:update",
    "products:create",
    "products:read",
    "products:update",
    "experiences:read"
  ],
  "entryPoint": "index.html",
  "iframe": true,
  "width": "100%",
  "height": "600px"
}
EOF

echo "📋 Deployment package created in 'whop-deploy' directory"
echo ""
echo "🎯 Next steps:"
echo "1. Upload the contents of 'whop-deploy' directory to your Whop app"
echo "2. Set your Gemini API key in the app settings"
echo "3. Test the app in your Whop experience"
echo ""
echo "📁 Files ready for upload:"
ls -la whop-deploy/

echo ""
echo "✅ Deployment package ready!"