FROM node:20-alpine

COPY package.json package-lock.json ./
RUN npm install
COPY . /ofs/frontend
WORKDIR  /ofs/frontend

EXPOSE 3000

RUN npm run build 

CMD ["npm", "start"] 
