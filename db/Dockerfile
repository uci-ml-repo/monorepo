FROM mysql:5.7
# Add a database
ENV MYSQL_DATABASE=mlrepo
ENV MYSQL_HOST=%
ENV MYSQL_ROOT_PASSWORD=root
# Add copy of ucimlrepo's database to the image
# All scripts in docker-entrypoint-initdb.d/ are automatically
# executed during container startup
ADD mlrepo.sql /docker-entrypoint-initdb.d/
