#!/bin/bash

# 📍 CONFIGURATION
GCP_URL="https://afridam-ai2-api-131829695574.us-central1.run.app/api/v1"
RENDER_URL="https://afridamai-backend.onrender.com/api"
VERCEL_URL="https://app.afridamai.com"

echo "🛡️ STARTING AFRIDAM AI HANDSHAKE VERIFICATION..."
echo "-----------------------------------------------"

# 1. TEST GCP AI BRAIN (Root Health Check)
echo "📡 Testing GCP AI Brain @ $GCP_URL..."
curl -s -o /dev/null -w "GCP Status: %{http_code}\n" "https://afridam-ai2-api-131829695574.us-central1.run.app/"

# 2. TEST AI SCANNER ENDPOINT (Multipart/Form-Data)
# This simulates an image upload without needing a real file.
echo "🔬 Testing AI Scanner Handshake (/skin-diagnosis)..."
curl -X POST "$GCP_URL/skin-diagnosis" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/dev/null;type=image/jpeg" \
  -F "more_info={\"region\":\"West Africa\",\"gender\":\"female\"}" \
  -w "Scanner Response: %{http_code}\n" -s -o /dev/null

# 3. TEST RENDER BACKEND (Auth Check)
echo "☁️ Testing Render Backend @ $RENDER_URL..."
curl -s -o /dev/null -w "Render Status: %{http_code}\n" "$RENDER_URL/auth/user/login"

# 4. TEST VERCEL FRONTEND
echo "🌐 Testing Vercel Frontend @ $VERCEL_URL..."
curl -s -o /dev/null -w "Vercel Status: %{http_code}\n" "$VERCEL_URL"

echo "-----------------------------------------------"
echo "✅ HANDSHAKE COMPLETE."
