# Use the official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the app dependencies inside the container
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Expose port 4000 to the host so we can access our app outside of the container
EXPOSE 4000

# The command to start the app inside the container
CMD [ "npm", "start" ]
