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
COPY apps/documents apps/documents

# Build the application
RUN npm run build documents

# Stage 2: Create the production image
FROM node:20-alpine
ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /documents

# Copy only the build output from the previous stage
COPY --from=build /build/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/apps/documents/main.js"]