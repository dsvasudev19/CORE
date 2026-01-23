#!/bin/bash

# Test script to verify payroll permissions are working
# Usage: ./test-payroll-permissions.sh <JWT_TOKEN> <ORG_ID>

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <JWT_TOKEN> <ORG_ID>"
    echo "Example: $0 eyJhbGc... 1"
    exit 1
fi

JWT_TOKEN="$1"
ORG_ID="$2"
BASE_URL="http://localhost:8080"

echo "🧪 Testing Payroll Permissions..."
echo "=================================="
echo ""

# Test 1: Get all payrolls for organization
echo "📋 Test 1: GET /api/payroll/organization/${ORG_ID}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/api/payroll/organization/${ORG_ID}" \
    -H "Authorization: Bearer ${JWT_TOKEN}" \
    -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ SUCCESS: Status code 200"
    echo "Response: $BODY"
else
    echo "❌ FAILED: Status code $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""

# Test 2: Get payroll summary
echo "📊 Test 2: GET /api/payroll/organization/${ORG_ID}/summary"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/api/payroll/organization/${ORG_ID}/summary?month=1&year=2024" \
    -H "Authorization: Bearer ${JWT_TOKEN}" \
    -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ]; then
    echo "✅ SUCCESS: Status code $HTTP_CODE (endpoint accessible)"
    echo "Response: $BODY"
else
    echo "❌ FAILED: Status code $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""

# Test 3: Check if we get authentication error
echo "🔍 Test 3: Checking for authentication errors..."
if echo "$BODY" | grep -q "authentication error"; then
    echo "❌ FAILED: Still getting authentication error"
    echo "   Please run the SQL script or restart the application"
else
    echo "✅ SUCCESS: No authentication errors detected"
fi
echo ""

echo "=================================="
echo "✨ Testing complete!"
