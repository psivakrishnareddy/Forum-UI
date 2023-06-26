FROM node:16-alpine3.12 as builder

RUN mkdir /cov.sbsd.dashboard.forum
WORKDIR /cov.sbsd.dashboard.forum
COPY *.json ./container_files/templates/nginx.conf ./
COPY src/ /cov.sbsd.dashboard.forum/src/
COPY public/ /cov.sbsd.dashboard.forum/public/
#COPY build/ /cov.sbsd.certapp-angular-migration.ui/build/
RUN npm i 
RUN npm run build
# RUN $(npm bin)/npm build --configuration=production --prod --aot --build-optimizer --vendor-chunk --output-hashing=all
#RUN npm run post-build


FROM nginx:1.13.3-alpine
RUN set -ex && apk --no-cache add sudo
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /cov.sbsd.dashboard.forum/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /cov.sbsd.dashboard.forum/build/ /usr/share/nginx/html/
COPY ./container_files/scripts/entrypoint.sh /container_files/entrypoint.sh
COPY ./container_files/templates/default.conf /etc/nginx/conf.d/default.conf
RUN chmod +x /container_files/entrypoint.sh
RUN chown -R nginx:nginx /container_files/ /etc/nginx/ /usr/share/nginx/ /var/cache/nginx/ /var/log/nginx/ /usr/sbin/nginx /var/run/
# USER nginx
ENTRYPOINT ["/container_files/entrypoint.sh"]
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]