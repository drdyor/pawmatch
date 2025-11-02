#!/bin/bash
# Quick Deployment Script for PawMatch

echo "🚀 PawMatch EAS Deployment"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Check if logged in
echo "Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo "⚠️  Not logged in. Please run: eas login"
    exit 1
fi

echo "✅ Logged in to EAS"
echo ""

# Check if configured
if [ ! -f "eas.json" ]; then
    echo "⚙️  Configuring EAS..."
    eas build:configure
fi

echo ""
echo "Choose deployment option:"
echo "1) Build for production (iOS + Android)"
echo "2) Build iOS only"
echo "3) Build Android only"
echo "4) Submit to stores (after builds complete)"
echo "5) Exit"
echo ""

read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo "📦 Building for iOS and Android..."
        eas build --platform all --profile production
        ;;
    2)
        echo "🍎 Building for iOS..."
        eas build --platform ios --profile production
        ;;
    3)
        echo "🤖 Building for Android..."
        eas build --platform android --profile production
        ;;
    4)
        echo "📤 Submitting to app stores..."
        read -p "Submit iOS? (y/n): " ios_submit
        read -p "Submit Android? (y/n): " android_submit
        
        if [ "$ios_submit" = "y" ]; then
            eas submit --platform ios --profile production
        fi
        
        if [ "$android_submit" = "y" ]; then
            eas submit --platform android --profile production
        fi
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done! Check your builds at: https://expo.dev/builds"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
