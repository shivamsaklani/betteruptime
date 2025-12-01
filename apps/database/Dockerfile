FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh



EXPOSE 5000

ENTRYPOINT ["/entrypoint.sh"]
