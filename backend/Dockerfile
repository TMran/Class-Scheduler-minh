# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create directories with proper permissions
RUN mkdir -p Database uploads && \
    chmod 755 Database uploads

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]