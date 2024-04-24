FROM node:20-alpine

COPY package.json package-lock.json ./
RUN npm install
COPY . /ofs/frontend
WORKDIR  /ofs/frontend

RUN npm run build 
CMD ["npm", "start"] 