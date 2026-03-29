#!/bin/bash
echo "🚀 Starting Full AI SaaS System..."
echo ""
echo "📦 Installing dependencies..."
yarn install
cd frontend && yarn install && cd ..

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "Starting backend on http://localhost:3001"
echo "Starting frontend on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start backend in background
node index.js &
BACKEND_PID=$!

# Start frontend in background
cd frontend && yarn dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
