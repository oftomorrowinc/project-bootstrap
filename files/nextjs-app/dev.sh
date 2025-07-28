#!/bin/bash

# scripts/dev.sh - Development server with logging

# Create logs directory if it doesn't exist
mkdir -p logs

# If dev.log exists, move it to timestamped file
if [ -f "logs/dev.log" ]; then
    TIMESTAMP=$(date +%s)
    mv "logs/dev.log" "logs/dev-${TIMESTAMP}.log"
    echo "Previous log moved to logs/dev-${TIMESTAMP}.log"
fi

# Create empty dev.log
touch logs/dev.log

# Start Next.js dev server and pipe output to both console and log file
echo "Starting development server... (logs: logs/dev.log)"
npx next dev 2>&1 | tee logs/dev.log