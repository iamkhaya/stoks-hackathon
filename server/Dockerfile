# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the necessary port
EXPOSE 5002

# Start the server
CMD ["npm", "start"]