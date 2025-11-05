# ---------- Builder ----------
FROM oven/bun:1.1.25 AS builder

WORKDIR /app

# Copy everything from root of monorepo (not just API)
COPY . .

# Bun will now see packages/ and apps/
RUN bun install --frozen-lockfile

# Build API
WORKDIR /app/apps/API
RUN bun run build

# ---------- Runtime ----------
FROM oven/bun:1.1.25 AS runtime

WORKDIR /app

# Copy built output and dependencies
COPY --from=builder /app/apps/API /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages

EXPOSE 3000
CMD ["bun", "run", "start"]
