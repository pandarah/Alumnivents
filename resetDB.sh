#!/bin/bash

# Script to reset the database from the database backup

# Instructions:
# run `chmod +x resetDB.sh` to set permissions
# run `./resetDB.sh` to execute

rm -rf alumnivents.db
cp -r alumnivents_backup.db ./alumnivents.db