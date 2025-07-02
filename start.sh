#!/bin/bash

echo "Starting backend server..."

# copy config file to backend directory
cp config.ts backend/config.ts
cd backend && npm run dev &

echo "Starting frontend server..."
cd frontend && npm run dev &

echo "Both servers are starting..."
echo "Press Ctrl+C to stop both servers"

wait