#!/bin/bash

# Image Loading Verification Script
# This script helps verify that images are loading correctly

echo "🔍 Property Images Loading Verification"
echo "========================================"
echo ""

# Check environment variable
echo "1. Checking API URL configuration..."
if [ -f .env.local ]; then
  API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d '=' -f2)
  echo "   ✅ .env.local found"
  echo "   📍 API URL: $API_URL"
else
  echo "   ⚠️  .env.local not found"
  echo "   📝 Please create .env.local with:"
  echo "      NEXT_PUBLIC_API_URL=https://m4pmencesm.ap-south-1.awsapprunner.com/api"
fi
echo ""

# Check if API is accessible
echo "2. Testing API connectivity..."
API_URL=${API_URL:-"https://m4pmencesm.ap-south-1.awsapprunner.com/api"}
if curl -s -o /dev/null -w "%{http_code}" "$API_URL/items" | grep -q "200"; then
  echo "   ✅ API is accessible"
else
  echo "   ❌ API is not accessible or returned error"
  echo "   🔗 URL: $API_URL/items"
fi
echo ""

# Fetch sample property and check images
echo "3. Checking property image URLs..."
RESPONSE=$(curl -s "$API_URL/items?limit=1")
if [ ! -z "$RESPONSE" ]; then
  echo "   ✅ API returned data"
  
  # Extract first image URL (requires jq)
  if command -v jq &> /dev/null; then
    FIRST_IMAGE=$(echo $RESPONSE | jq -r '.[0].gallery[0] // .[0].image // "No image found"')
    echo "   🖼️  Sample image URL: $FIRST_IMAGE"
    
    # Check if image URL is accessible
    if [[ $FIRST_IMAGE == http* ]]; then
      if curl -s -o /dev/null -w "%{http_code}" "$FIRST_IMAGE" | grep -q "200"; then
        echo "   ✅ Image is accessible"
      else
        echo "   ❌ Image URL returned error"
      fi
    fi
  else
    echo "   ℹ️  Install 'jq' to extract image URLs: npm install -g jq"
  fi
else
  echo "   ❌ No data returned from API"
fi
echo ""

# Check next.config.ts for remote patterns
echo "4. Checking Next.js image configuration..."
if grep -q "m4pmencesm.ap-south-1.awsapprunner.com" next.config.ts; then
  echo "   ✅ AWS AppRunner hostname found in config"
else
  echo "   ❌ AWS AppRunner hostname NOT found in config"
fi

if grep -q "\*\*.amazonaws.com" next.config.ts; then
  echo "   ✅ AWS wildcard pattern found in config"
else
  echo "   ⚠️  AWS wildcard pattern NOT found in config"
fi
echo ""

# Build verification
echo "5. Verifying build..."
if [ -d ".next" ]; then
  echo "   ✅ Build directory exists"
  echo "   💡 Run 'npm run build' to rebuild if you made changes"
else
  echo "   ⚠️  No build found"
  echo "   🔨 Run: npm run build"
fi
echo ""

echo "========================================"
echo "📋 Summary:"
echo "   To fix image loading issues:"
echo "   1. Ensure NEXT_PUBLIC_API_URL is set correctly"
echo "   2. Rebuild: npm run build"
echo "   3. Test locally: npm start"
echo "   4. Deploy to production"
echo ""
echo "   Production URL: https://www.rinoproperties.com"
echo "========================================"
