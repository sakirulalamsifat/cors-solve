FROM node:10-alpine

# Create app directory
WORKDIR /home/ubuntu/mlajan_service/merchent_service

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install express
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5028
CMD [ "npm", "start" ]
