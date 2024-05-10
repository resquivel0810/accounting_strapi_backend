# Use a Node LTS base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy both package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install only production dependencies using npm ci
RUN npm ci --only=production

# Copy the entire application code to the working directory
COPY . .

# Build the application in production mode
RUN npm run build

# Expose port 1337 for the Strapi application
EXPOSE 1337

# Start the application in production mode
CMD ["npm", "run", "start"]
