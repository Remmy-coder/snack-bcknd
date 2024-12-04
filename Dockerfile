# Use the official Node.js 22 image
FROM node:22-alpine 

# Set the working directory in the container
WORKDIR /app

# Copy your application files to the container
COPY package*.json ./

# Install application dependencies 
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port the application runs on
EXPOSE 3000

# Run migration and then start the application
CMD [ "sh", "-c", "npm run migration:run && npm start" ]
