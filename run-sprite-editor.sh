#!/bin/bash

echo "Starting Sprite Editor Server..."
echo ""

# Kill any existing server on port 8081
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping existing server on port 8081..."
    kill $(lsof -Pi :8081 -sTCP:LISTEN -t)
    sleep 1
fi

# Start the sprite editor server
cd sprite-editor
node run-editor.js

# If node fails, try with python as fallback
if [ $? -ne 0 ]; then
    echo ""
    echo "Node.js server failed. Trying Python server..."
    echo ""
    cd ..
    python3 -m http.server 8081 --directory sprite-editor
fi