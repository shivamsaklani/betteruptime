# ---------- Builder ----------
FROM oven/bun:1.1.25 AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN bun install

# Build Next.js
RUN bun run build

# ---------- Runner ----------
FROM oven/bun:1.1.25 AS runner

WORKDIR /app

# Copy built output and node_modules
COPY --from=builder /app ./

EXPOSE 3000

CMD ["bun", "run", "start"]
