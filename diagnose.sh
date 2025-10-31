#!/bin/bash

echo "🔍 PAWMATCH DIAGNOSTIC SCRIPT"
echo "=============================="
echo ""

# Check location
echo "📁 1. Checking current location..."
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile 2>/dev/null || {
    echo "❌ Cannot find project directory!"
    echo "   Expected: /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile"
    echo "   Current: $(pwd)"
    exit 1
}
echo "✅ Location: $(pwd)"
echo ""

# Check Node.js
echo "📦 2. Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found! Install from https://nodejs.org"
    exit 1
fi
echo ""

# Check npm
echo "📦 3. Checking npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found!"
    exit 1
fi
echo ""

# Check project files
echo "📄 4. Checking project files..."
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json not found!"
    exit 1
fi
echo ""

# Check node_modules
echo "📦 5. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    echo "   Size: $(du -sh node_modules 2>/dev/null | cut -f1)"
else
    echo "❌ node_modules MISSING - need to run: npm install"
fi
echo ""

# Test internet
echo "🌐 6. Testing internet connection..."
if ping -c 2 google.com &> /dev/null; then
    echo "✅ Internet connection: OK"
else
    echo "❌ Internet connection: FAILED"
    echo "   Check your WiFi/network connection"
fi
echo ""

# Test npm registry
echo "📡 7. Testing npm registry..."
npm ping &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ npm registry: ACCESSIBLE"
else
    echo "❌ npm registry: CANNOT REACH"
    echo "   This is likely the main problem!"
    echo ""
    echo "   Try:"
    echo "   1. Check firewall/proxy settings"
    echo "   2. Try: npm config set registry https://registry.npmmirror.com"
    echo "   3. Use mobile hotspot"
fi
echo ""

# Summary
echo "=============================="
echo "📊 SUMMARY:"
echo ""
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
    echo "   Next step: npm start"
else
    echo "❌ Need to install dependencies"
    echo "   Run: npm install"
    echo ""
    if ! ping -c 1 google.com &> /dev/null; then
        echo "⚠️  INTERNET ISSUE DETECTED"
        echo "   Fix network connection first!"
    fi
fi
echo ""
