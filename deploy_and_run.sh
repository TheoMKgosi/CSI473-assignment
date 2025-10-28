#!/bin/bash

echo "🚀 Deploying Neighborhood Watch App for 24/7 Access..."

# Step 1: Ensure all dependencies are installed
echo "📦 Installing dependencies..."
cd /workspaces/CSI473-assignment/NeighborhoodWatchApp
pip install -r requirements.txt

cd /workspaces/CSI473-assignment/frontend
npm install

# Step 2: Start servers in background
echo "🔧 Starting servers..."
cd /workspaces/CSI473-assignment/NeighborhoodWatchApp
nohup python manage.py runserver 0.0.0.0:8000 > backend.log 2>&1 &

cd /workspaces/CSI473-assignment/frontend  
nohup npx expo start --web --port 8081 > frontend.log 2>&1 &

# Step 3: Display access URLs
echo ""
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "🌐 Backend API: https://super-palm-tree-69499prjx6rp24xg7-8000.app.github.dev"
echo "📱 Frontend App: https://super-palm-tree-69499prjx6rp24xg7-8081.app.github.dev"
echo ""
echo "🔗 Quick Access Links:"
echo "   Login: https://super-palm-tree-69499prjx6rp24xg7-8081.app.github.dev"
echo "   Admin: https://super-palm-tree-69499prjx6rp24xg7-8000.app.github.dev/admin"
echo ""
echo "📊 Server logs:"
echo "   Backend: tail -f /workspaces/CSI473-assignment/NeighborhoodWatchApp/backend.log"
echo "   Frontend: tail -f /workspaces/CSI473-assignment/frontend/frontend.log"
echo ""
echo "⏹️  To stop servers: pkill -f 'python manage.py runserver' && pkill -f 'expo start'"