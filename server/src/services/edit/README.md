# Editing Services

## Architecture Strategy

- The client makes a request to the server
- the connection is facilitated through tRPC and processed by a resolver
- a resolver is a "controller", which will redirect the client's request to a backend service
- the corresponding service will handle operations within the backend, e.g. the database
- the service finishes, and returns its data to the controller, which will return it to the client

## Editing Services

- editing services should only know how to do CRUD operations and validate the data they receive
- these services process requests primarily concerning the admin dashboard
- each service inherits from a base edit_service class which will provide utilities
