# Use a lightweight Node.js image
FROM node:13-alpine

# Set working directory
WORKDIR /

# Copy package files and install dependencies
COPY package.json  ./
RUN npm install --only=production

# Copy application files
COPY . .

# Build the React frontend
RUN npm run build

# Expose the port
EXPOSE 3000

# Command to start the server
CMD ["npm", "start"]
