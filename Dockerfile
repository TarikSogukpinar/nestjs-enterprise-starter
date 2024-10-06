# Base image
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN pnpm run build

# Expose port
EXPOSE 3010

# Start the app
CMD ["pnpm", "run", "start:prod"]