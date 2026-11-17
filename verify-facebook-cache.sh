#!/bin/bash

# Facebook Cache Optimization Verification Script
# This script helps verify that the service worker implementation is working correctly

echo "=================================================="
echo "Facebook Cache Optimization Verification"
echo "=================================================="
echo ""

# Check if sw.js exists
echo "1. Checking Service Worker file..."
if [ -f "public/sw.js" ]; then
    echo "   ✅ Service Worker file exists: public/sw.js"
    echo "   📦 Size: $(wc -c < public/sw.js) bytes"
else
    echo "   ❌ Service Worker file NOT found"
    exit 1
fi
echo ""

# Check if _document.tsx has service worker registration
echo "2. Checking Service Worker registration..."
if grep -q "serviceWorker.register" "src/pages/_document.tsx"; then
    echo "   ✅ Service Worker registration found in _document.tsx"
else
    echo "   ❌ Service Worker registration NOT found"
    exit 1
fi
echo ""

# Check CSP headers in next.config.ts
echo "3. Checking Content Security Policy headers..."
if grep -q "worker-src 'self'" "next.config.ts"; then
    echo "   ✅ worker-src directive found in CSP"
else
    echo "   ⚠️  worker-src directive NOT found in CSP"
fi

if grep -q "connect.facebook.net" "next.config.ts"; then
    echo "   ✅ Facebook domains found in CSP"
else
    echo "   ⚠️  Facebook domains NOT found in CSP"
fi
echo ""

# Check service worker cache headers
echo "4. Checking Service Worker cache headers..."
if grep -q "Service-Worker-Allowed" "next.config.ts"; then
    echo "   ✅ Service-Worker-Allowed header configured"
else
    echo "   ⚠️  Service-Worker-Allowed header NOT configured"
fi
echo ""

echo "=================================================="
echo "Pre-Deployment Checklist"
echo "=================================================="
echo "[ ] Service Worker file created"
echo "[ ] Service Worker registered in _document.tsx"
echo "[ ] CSP headers updated"
echo "[ ] Cache headers configured"
echo ""

echo "=================================================="
echo "Post-Deployment Testing"
echo "=================================================="
echo ""
echo "1. Open Chrome DevTools → Application → Service Workers"
echo "   - Verify 'sw.js' is registered"
echo ""
echo "2. Visit your site and check Network tab"
echo "   - First load: fbevents.js from network"
echo "   - Reload: fbevents.js from ServiceWorker"
echo ""
echo "3. Check Cache Storage"
echo "   - Application → Cache Storage → rino-facebook-cache-v1"
echo "   - Should contain Facebook resources"
echo ""
echo "4. Run Lighthouse audit"
echo "   npx lighthouse https://rinoproperties.com --view"
echo "   - Check 'Efficient cache policy' section"
echo ""
echo "=================================================="
echo "Expected Savings: 111 KiB on repeat visits"
echo "=================================================="
