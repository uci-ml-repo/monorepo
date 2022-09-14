#Helpers for working with SQL database

# files

## Makefile
make is a utility for building/compiling projects. Here, it's just used as a
shortcut for the above command. It'll run
```
sh ./db.sh -t < query.sql
```
To invoke it, type
```
make
```
in this directory.

## db.sh
This executable shell script logs you into the sql shell,
accepts additional options from command line

Change the env at the top to the correct environment, and make sure the variables
for production and development are correct.

## query.sql
This is a raw SQL query. Doesn't do anything on its own, but you can pass it in
as an input to db.sh, e.g.

```
./db.sh < query.sql
```
or 

```
sh ./db.sh < query.sql
```
if it's not executable
