# print out results in tabular format
OPTIONS = -t

# establish connection with db
DB = ./db.sh

# perform query on db
QUERY = query.sql

.PHONY : query
query: QUERY

% :
	sh $(DB) $(OPTIONS) < $($@)
