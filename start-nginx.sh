#!/bin/sh

export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);

configFile=/usr/share/nginx/html/config.js
tmpConfigFile=/usr/share/nginx/html/config.js.tmp
envsubst $EXISTING_VARS < $configFile > $tmpConfigFile
mv $tmpConfigFile $configFile

nginxFile=/etc/nginx/conf.d/default.conf
tmpNginxFile=/etc/nginx/conf.d/default.conf.tmp
envsubst $EXISTING_VARS < $nginxFile > $tmpNginxFile
mv $tmpNginxFile $nginxFile

indexFile=/usr/share/nginx/html/index.html
tmpIndexFile=/usr/share/nginx/html/index.html.tmp
sed 's/"\/administrator/"\'"$BASE_URL"'/g' $indexFile > $tmpIndexFile
mv $tmpIndexFile $indexFile
sed 's/"\/api/"\'"$API_URL"'/g' $indexFile > $tmpIndexFile
mv $tmpIndexFile $indexFile
sed 's/"\/login/"\'"$LOGIN_URL"'/g' $indexFile > $tmpIndexFile
mv $tmpIndexFile $indexFile
sed 's/"\/logout/"\'"$LOGOUT_URL"'/g' $indexFile > $tmpIndexFile
mv $tmpIndexFile $indexFile

nginx -g 'daemon off;'