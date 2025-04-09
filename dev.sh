#!/bin/bash

echo "Starting HTMX-MFE development environment..."

# Run TypeScript in watch mode
npm run watch &
TS_PID=$!

# Run Tailwind in watch mode
npx tailwindcss -i ./static/css/input.css -o ./static/css/tailwind.css --watch &
TAILWIND_PID=$!

# Run Go application
go run main.go &
GO_PID=$!

# Function to kill all processes on exit
cleanup() {
  echo "Shutting down development environment..."
  kill $TS_PID
  kill $TAILWIND_PID
  kill $GO_PID
  exit 0
}

# Register the cleanup function for when script is terminated
trap cleanup SIGINT SIGTERM

# Wait for user to press Ctrl+C
echo "Development environment running. Press Ctrl+C to stop."
wait
