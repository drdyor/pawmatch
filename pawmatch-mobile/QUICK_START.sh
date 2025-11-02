#!/bin/bash
# Quick Start Script for PawMatch Mobile

echo "🚀 Starting PawMatch Mobile..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  Warning: .env file not found!"
  echo "   Please copy .env.example to .env and add your Supabase credentials"
  echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Clear cache and start
echo "🧹 Clearing Expo cache..."
rm -rf .expo

echo "🎯 Starting Expo..."
echo ""
echo "📱 Next steps:"
echo "   - Scan QR code with Expo Go app"
echo "   - Or press 'i' for iOS / 'a' for Android"
echo ""

npx expo start --clear
