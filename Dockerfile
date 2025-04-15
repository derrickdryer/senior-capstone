# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

# Run CRUD tests 
RUN npm run crud-test

# Copy SSL certificates
#COPY certs/server.crt /etc/ssl/certs/hidden-it-com.crt
#COPY certs/server.key /etc/ssl/private/hidden-it-com.key

ENV DB_USER=root
ENV DB_PASSWORD="SuperSecretPassword"
ENV DB_HOST=IP
ENV DB_PORT=3306
ENV DB_DATABASE=root
ENV JWT_SECRET=secret
#ENV USE_LOCAL_SSL=false

# Expose the port the app runs on
EXPOSE 3000

# Start the application
ENTRYPOINT ["npm", "start"]