#!/bin/bash -x

CURR_DATE=$(date +"%Y_%m_%d")

echo "Backing up MySQL database"
DB_CONTAINER_ID=$(docker ps -aqf name=^/db\$)
docker exec -it ${DB_CONTAINER_ID} mysqldump ucimlrepo > $1/${CURR_DATE}.sql
echo "MySQL database successfully backed up as $1/${CURR_DATE}.sql"

