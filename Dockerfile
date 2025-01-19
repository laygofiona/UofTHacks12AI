# Use a base image with Node.js pre-installed
FROM node:23

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exist) to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application listens on
EXPOSE 5173

# Command to run your application
CMD ["npm", "run", "dev", "--", "--port", "5173", "--host"]
