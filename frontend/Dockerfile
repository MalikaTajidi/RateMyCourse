#this is the new dockerfile it is better for production 
# Use Node.js as the base image for building the Angular app
FROM node:latest as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

COPY . .
RUN ng build --configuration production

#The Angular app is built using ng build, creating static files in dist/front/browser/.
#Nginx takes these files and serves them to users when they visit the website.
#When a user opens the app, Nginx serves index.html, which loads the JavaScript and styles.
#Angular handles routing dynamically, and Nginx ensures the app works even with deep links
FROM nginx:latest

# Copy built files from the previous stage to Nginx's web root
COPY --from=build-stage /app/dist/front/browser/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD nginx -g "daemon off;"