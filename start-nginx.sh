#!/bin/sh

export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);

configFile=/usr/share/nginx/html/config.js
cat $configFile | envsubst $EXISTING_VARS | tee $configFile

nginxFile=/etc/nginx/conf.d/default.conf
cat $nginxFile | envsubst $EXISTING_VARS | tee $nginxFile

indexFile=/usr/share/nginx/html/index.html
cat $indexFile | sed 's/"\/administrator/"\'"$BASE_URL"'/g' | tee $indexFile

nginx -g 'daemon off;'