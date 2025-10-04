#!/bin/bash

# UVZ Course Launchpad AI - Vercel Deployment Script

echo "🚀 Deploying UVZ Course Launchpad AI to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Your app is now live on Vercel!"
echo "🔗 Check your Vercel dashboard for the live URL"
echo ""
echo "🎯 App Features:"
echo "✅ UVZ Input Collection"
echo "✅ AI Course Concept Generation"
echo "✅ Complete Course Creation"
echo "✅ Whop API Integration"
echo "✅ Marketing Assets Download"
echo ""
echo "🔧 Environment Variables Configured:"
echo "✅ Gemini API Key: AIzaSyBxKkT49hnFi6yXf7JVboFY-aLeHrHCOCI"
echo "✅ Whop API Key: fUaz0J7H-ixhluIyo7FpGhhDSBa_50_5Cw6xlA48E38"
echo "✅ Whop App ID: app_1CSGwlh2Of6r50"
echo "✅ Whop Company ID: biz_qBykJdUrk3W1wv"
echo ""
echo "🎉 Your UVZ Course Launchpad AI is live!"