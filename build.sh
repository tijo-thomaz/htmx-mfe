#!/bin/bash

echo "Building HTMX-MFE..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  npm install
fi

# Build TypeScript files
echo "Building TypeScript files..."
npm run build

# Build CSS with Tailwind
echo "Building CSS with Tailwind..."
npx tailwindcss -i ./static/css/input.css -o ./static/css/tailwind.css

# Build Go application
echo "Building Go application..."
go build -o htmx-mfe

echo "Build complete! Run ./htmx-mfe to start the server."
