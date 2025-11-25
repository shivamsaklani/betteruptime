#!/bin/sh
set -e

echo "Waiting for Neon DB..."

until echo "SELECT 1;" | bunx prisma db execute --stdin; do
  echo "Neon not ready yet... retrying in 3 seconds..."
  echo $DATABASE_URL

  sleep 3
done

echo "Database connection successful!"

bunx prisma migrate deploy
bunx prisma generate
bun start
