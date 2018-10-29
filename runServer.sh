#!/bin/bash
#if this script is not running,
#	run chmod +x .sh and then execute

# kill old server process
#unfortunately process must be killed before starting new server
PID="$(cat tmp/pid.txt)"
kill $PID

#start new server
screen -d -m node server.js

#update ip
node ip/getIP.js 

#get pid of new screen process running
screen -ls | sed -n '2p' | cut -d '.' -f 1 | tr -d "[:blank:]" > tmp/pid.txt
