# ---------- Builder / Final Image ----------
FROM oven/bun:1.1.25

WORKDIR /app

# Copy entire API
COPY . .

# Install dependencies
RUN bun install

# Expose API port
EXPOSE 3001

# Start the API
CMD ["bun", "start"]
