#!/bin/bash

# True Travel Deployment Script

echo "🚀 Starting True Travel deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: True Travel B2B Platform"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No Git remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/truetravel.git"
    echo "   git push -u origin main"
    exit 1
fi

# Push latest changes
echo "📤 Pushing changes to GitHub..."
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
git push

echo "✅ Deployment complete!"
echo "🌐 Your client can access the live site at:"
echo "   https://your-app.vercel.app"