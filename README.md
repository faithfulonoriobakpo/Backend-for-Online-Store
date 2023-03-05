# Storefront Backend Project

This repo contains a basic Node and Express app for the backend of an store.

## Application Stack

This application makes use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- bcrypt for hashing passwords
- jasmine from npm for testing

## Running the Application

To run this application, you to

- Download or clone this repo
- Run npm install to install required dependencies.
- Set up database
  - Install postgres. Instructions for installation on different OS can be found <a href="https://www.postgresql.org/download/" target="_blank">here.</a>
  - Start postgres server by the following the instructions <a href="https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html">here</a>.
  Open your computer terminal (command line), type 'psql', hit enter. Psql is an interactive terminal to work with the PostgreSQL database.
  After entering psql interactive termninal, enter the following commands
  - CREATE USER admin WITH PASSWORD 'password123'; (Creates a user called "admin" with password: "password123")
  - CREATE DATABASE my-online-store; (Creates a database for application with name 'my-online-store')
  - CREATE DATABASE my-online-store-test; (Creates a test database for application)
  - GRANT ALL PRIVILEGES ON DATABASE my-online-store TO admin;
  - GRANT ALL PRIVILEGES ON DATABASE my-online-store-test TO admin;

- Create a .env file at the root of the project and create the following env variables.
``` POSTGRES_HOST = 127.0.0.1
    POSTGRES_DATABASE = my-online-store
    POSTGRES_DATABASE_TEST = my-online-store-test
    POSTGRES_USERNAME = faithfulonoriobakpo
    POSTGRES_PASSWORD = password123
    SALT_ROUND=10
    PEPPER=$weetpepe
    JWT_SECRET=myspecialsecret
    AUTH_USERNAME=authtoken
    AUTH_PASSWORD=Acce$$101
    ENV=dev
```
  > Feel free to change SALT_ROUND, PEPPER, JWT_SECRET, AUTH_USERNAME=authtoken, AUTH_PASSWORD to values of your choice.

- From a different terminal, run the command 'npm run watch' to run the application locally on 127.0.0.1:3000.


## Endpoints

All endpoints are available in the <a href="https://github.com/faithfulonoriobakpo/Backend-for-Online-Store/blob/main/REQUIREMENTS.md">REQUIREMENTS.md</a> file.

## Testing

- run 'npm run test'. This uses migrations to create tables for period of test and drop them after the tests.