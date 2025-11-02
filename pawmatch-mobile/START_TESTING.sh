#!/bin/bash

echo "🐾 PawMatch Mobile - Quick Start Testing"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from pawmatch-mobile directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "   Copy .env.example and configure Supabase keys"
    exit 1
fi

echo "✅ Environment configured"
echo "✅ Dependencies installed"
echo ""
echo "🚀 Starting Expo development server..."
echo ""
echo "📱 NEXT STEPS:"
echo "   1. Install 'Expo Go' app on your phone"
echo "   2. Make sure phone and computer are on same WiFi"
echo "   3. Scan the QR code that will appear"
echo "   4. Wait 30-60 seconds for app to load"
echo ""
echo "🧪 TEST THESE FEATURES:"
echo "   ✅ Sign up (email + password)"
echo "   ✅ Browse pets"
echo "   ✅ View pet details"
echo "   ✅ Upload photos"
echo "   ✅ Send messages"
echo ""
echo "⚠️  SKIP THESE (Have bugs):"
echo "   ❌ Breeder heat tracking"
echo "   ❌ Breeder stud matching"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm start
