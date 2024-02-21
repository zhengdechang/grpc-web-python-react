FROM nginx:stable-alpine
COPY dist /usr/share/nginx/html
COPY app.conf /etc/nginx/conf.d/default.conf
EXPOSE 7891
CMD ["nginx", "-g", "daemon off;"]
