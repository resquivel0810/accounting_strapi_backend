# Use a Node LTS base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy both package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies (not just production)
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Expose port 1337 for the Strapi application
EXPOSE 1337

# Start the application in development mode
CMD ["npm", "run", "develop"]
