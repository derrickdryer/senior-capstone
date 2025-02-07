# Use an official Node.js runtime as a parent image
FROM node:14

# Set default environment variables
ENV DB_USER=root
ENV DB_PASSWORD="SuperSecretPassword"
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_DATABASE=root

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
