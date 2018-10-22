#!/bin/bash

#start new server
screen node server.js &

#update ip
node ip/getIP.js 

# kill old server process

#get pid of new screen process running
screen -ls | sed -n '2p' | cut -d '.' -f 1 | tr -d "[:blank:]"
