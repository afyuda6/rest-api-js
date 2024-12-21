FROM node:22-slim

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /rest-api-js

COPY . /rest-api-js

RUN npm install

RUN npm rebuild sqlite3

EXPOSE 8080

CMD ["node", "main.js"]