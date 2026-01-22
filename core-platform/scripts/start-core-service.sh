#!/bin/bash

# Start Core Service (Spring Boot)
# Port: 8080

echo "🚀 Starting Core Service (Spring Boot)..."
echo "Port: 8080"
echo "API Docs: http://localhost:8080/swagger-ui.html"
echo ""

cd "$(dirname "$0")/../services/core-service"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed"
    echo "Please install Java 17 from: https://adoptium.net/"
    exit 1
fi

echo "✓ Java version:"
java -version

echo ""
echo "Starting Spring Boot application..."
echo "Press Ctrl+C to stop"
echo ""

./mvnw spring-boot:run
