# env: dev or prod (development/local database, or database on production machine)
env="dev"

# allow additional options to be passed in from the command line, e.g. the Makefile
OPTIONS=$1

# connect to your local/dev database
DEV_DB=mysql
DEV_USER=root
DEV_PASSWORD=root
DEV_NAME=mlrepo

# connect to production database
PROD_DB=mysql
PROD_USER=root
PROD_NAME=mlrepo
PROD_HOST=0.0.0.0
PROD_PORT=7200

case $env in
	"dev")
		$DEV_DB -u $DEV_USER -p$DEV_PASSWORD $DEV_NAME $OPTIONS
		;;
	"prod")
		$PROD_DB -u $PROD_USER -h$PROD_HOST -P $PROD_PORT $PROD_NAME $OPTIONS
		;;
	*)
		echo $env
		;;
esac
