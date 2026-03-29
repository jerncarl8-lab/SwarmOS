#!/bin/bash
clear
echo "╔════════════════════════════════════════╗"
echo "║   AI SaaS System - Quick Start 🚀      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Function to check if API keys exist
check_keys() {
    if [ -f .env ]; then
        if grep -q "sk-" .env && grep -q "re_" .env; then
            return 0
        fi
    fi
    return 1
}

# Setup API keys if needed
if ! check_keys; then
    echo "📝 First time setup - Let's add your API keys!"
    echo ""
    echo "Get your keys from:"
    echo "  • OpenAI: https://platform.openai.com/api-keys"
    echo "  • Resend: https://resend.com/api-keys"
    echo ""
    
    read -p "Enter OpenAI API Key (or press Enter to skip): " OPENAI_KEY
    read -p "Enter Resend API Key (or press Enter to skip): " RESEND_KEY
    
    # Use demo keys if user skips
    if [ -z "$OPENAI_KEY" ]; then
        OPENAI_KEY="your-openai-key-here"
    fi
    if [ -z "$RESEND_KEY" ]; then
        RESEND_KEY="your-resend-key-here"
    fi
    
    cat > .env << ENVEOF
OPENAI_API_KEY=$OPENAI_KEY
RESEND_API_KEY=$RESEND_KEY
PORT=3001
FRONTEND_URL=http://localhost:5173
ENVEOF
    
    echo ""
    echo "✅ Configuration saved to .env"
    echo ""
fi

echo "🔧 Installing dependencies (this may take a minute)..."
yarn install --silent > /dev/null 2>&1
cd frontend && yarn install --silent > /dev/null 2>&1 && cd ..

echo "✅ Ready to launch!"
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  Starting in 3 seconds...              ║"
echo "╚════════════════════════════════════════╝"
sleep 1
echo "  3..."
sleep 1
echo "  2..."
sleep 1
echo "  1..."
sleep 1
clear

echo "╔════════════════════════════════════════╗"
echo "║       🎉 SYSTEM IS RUNNING! 🎉         ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📊 Dashboard:  http://localhost:5173"
echo "🔧 Backend:    http://localhost:3001"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start backend
node index.js &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start frontend
cd frontend && yarn dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Backend running  (PID: $BACKEND_PID)"
echo "✅ Frontend running (PID: $FRONTEND_PID)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 Quick Actions:"
echo "   • Open Dashboard: http://localhost:5173"
echo "   • View Backend Logs: tail -f backend.log"
echo "   • Stop System: Press Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup function
cleanup() {
    echo ""
    echo ""
    echo "🛑 Shutting down..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    sleep 1
    echo "✅ System stopped successfully!"
    echo ""
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Keep running
wait
