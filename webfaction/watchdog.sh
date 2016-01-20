#!/usr/bin/env bash

PIDFILE="$HOME/.brianbondy_nodejs.pid"

if [ -e "${PIDFILE}" ] && (ps -u $USER -f | grep "[ ]$(cat ${PIDFILE})[ ]"); then
  echo "Already running."
  exit 99
fi

PATH=/home/tweetpig/webapps/brianbondy_node/bin:$PATH LD_LIBRARY_PATH=/home/tweetpig/lib/libgif NODE_ENV=production PORT=32757 /home/tweetpig/webapps/brianbondy_node/bin/node --harmony --max-old-space-size=200 /home/tweetpig/webapps/brianbondy_node/dist/server.js --brianbondy_node > $HOME/.brianbondy_nodejs.log &

echo $! > "${PIDFILE}"
chmod 644 "${PIDFILE}"
