# Use Node LTS version as the base image
FROM node:lts

# Maintainer information
LABEL maintainer="haichang"

#Expose port 3000
EXPOSE 3000

# Create working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV production

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the source code to the container
COPY ./dist ./dist

# Set the default command to run when the container starts
CMD ["npm", "run", "start:prod"]
