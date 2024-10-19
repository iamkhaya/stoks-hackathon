# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the dashboard code
COPY . .

# Build the Vite app for production
RUN npm run build

# Serve the app
EXPOSE 5001

CMD ["npm", "run", "serve"]