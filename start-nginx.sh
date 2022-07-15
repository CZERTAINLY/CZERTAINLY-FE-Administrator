#!/bin/sh

export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);
for file in $JSFOLDER;
do
  cat $file | envsubst $EXISTING_VARS | tee $file
done

for file in /etc/nginx/conf.d/default.conf;
do
  cat $file | envsubst $EXISTING_VARS | tee $file
done

for file in /usr/share/nginx/html/index.html;
do
  cat $file | sed 's/"\/administrator/"\'"$BASE_URL"'/g' | tee $file
done

nginx -g 'daemon off;'