# Stage 1: Build the application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /build

# Copy package.json and package-lock.json
COPY *.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY libs libs
COPY apps/accounts apps/accounts

# Build the application
RUN npm run build accounts

# Stage 2: Create the production image
FROM node:20-alpine

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /build

# Copy the built application from the previous stage
COPY package*.json ./
COPY --from=build /build/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port the app runs on
EXPOSE 4000 4001

# Command to run the application
CMD ["node", "dist/apps/accounts/main.js"]