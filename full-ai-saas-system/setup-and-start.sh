#!/bin/bash

echo "🚀 AI SaaS System - Automatic Setup & Start"
echo "=========================================="
echo ""

# Check if .env has API keys
if ! grep -q "sk-" .env 2>/dev/null || ! grep -q "re_" .env 2>/dev/null; then
    echo "⚠️  API Keys Not Found!"
    echo ""
    echo "Please add your API keys:"
    echo ""
    read -p "OpenAI API Key (sk-...): " OPENAI_KEY
    read -p "Resend API Key (re_...): " RESEND_KEY
    
    cat > .env << ENVEOF
OPENAI_API_KEY=$OPENAI_KEY
RESEND_API_KEY=$RESEND_KEY
PORT=3001
FRONTEND_URL=http://localhost:5173
ENVEOF
    
    echo "✅ API keys saved!"
    echo ""
fi

echo "📦 Installing dependencies..."
echo ""

# Install backend deps silently
yarn install --silent 2>&1 | grep -v "warning" || true

# Install frontend deps silently  
cd frontend
yarn install --silent 2>&1 | grep -v "warning" || true
cd ..

echo "✅ Dependencies installed!"
echo ""
echo "🚀 Starting services..."
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start backend in background
node index.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait a bit for backend to start
sleep 2

# Start frontend in background
cd frontend
yarn dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "=========================================="
echo "🎉 System is running!"
echo ""
echo "📊 Dashboard: http://localhost:5173"
echo "🔧 API: http://localhost:3001/api"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop: kill $BACKEND_PID $FRONTEND_PID"
echo "=========================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Stopped!"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
