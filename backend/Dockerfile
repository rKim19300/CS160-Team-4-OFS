FROM node:20-alpine

# Set working directory for backend
WORKDIR /ofs/backend

# Copy package.json and package-lock.json files to cwd
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the backend application files
COPY . .

# Run "node populate_db.js" if db.db file does not exist
RUN if [ ! -f "db.db" ]; then \
        node populate_db.js; \
    fi

# Expose port that the backend runs on
EXPOSE 8888

# Start the backend server
CMD ["node", "app.js"]
