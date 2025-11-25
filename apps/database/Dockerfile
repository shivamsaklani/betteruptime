FROM oven/bun:latest

WORKDIR /app

# Install SSL (required for Prisma + Neon)
RUN apt-get update -y && apt-get install -y openssl

COPY . .
RUN bun install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh



EXPOSE 5000

ENTRYPOINT ["/entrypoint.sh"]
