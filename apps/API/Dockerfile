FROM oven/bun:1.1.25

WORKDIR /app

COPY . .

# Install dependencies
RUN bun install

# Expose API port
EXPOSE 3001

# Start app
CMD ["bun", "start"]
