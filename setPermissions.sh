#!/bin/bash

#set permission of all files to read write for owner
find /DCNFS/users/student/sedwin/coen174 -type f -name '*' ! -path '/DCNFS/users/student/sedwin/coen174/node_modules/*' ! -path '/DCNFS/users/student/sedwin/coen174/.*' -exec chmod 600 {} +

#set permission of all directories to read write execute for owner
find /DCNFS/users/student/sedwin/coen174 -type d -name '*' ! -path '/DCNFS/users/student/sedwin/coen174/node_modules/*' ! -path '/DCNFS/users/student/sedwin/coen174/.*' -exec chmod 700 {} +
