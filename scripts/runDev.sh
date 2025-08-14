#!/bin/sh
# Install dependencies
npm install

# Start Stripe listener with verbose output
echo "Starting Stripe CLI listener..."
stripe --api-key "${STRIPE_SECRET_KEY}" listen --forward-to http://labs-nginx-proxy:80/api/functions/v1/webhook-stripe --skip-verify --log-level debug &
STRIPE_PID=$!

# Start development server
npm run dev &

# Wait for both processes
wait;