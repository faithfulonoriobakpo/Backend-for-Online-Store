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


## API Endpoints

The application has 3 routes: users, products and orders, with multiple endpoints. Some of these endpoints require authentication.
All authentications use bearer token, which can be passed in the header, using authorization as key, or body or as a request param or in the request query using token as key. To generate token call the token endpoint.

### Token Endpoint

- Token

``` 
  Method: POST

  URL: authentication/generatetoken

  Payload: {
              "username":string,
              "password":string
            }

  username and password are AUTH_USERNAME & AUTH_PASSWORD in .env file.

  Response Sample: {
                      "message": "token generated successfully",
                      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF1dGh0b2tlbiIsImlhdCI6MTY3NzgwMzcxNCwiZXhwIjoxNjc3ODA3MzE0fQ.IJQ6U9KbFuVF4LgpAzolq39tGVKiNwGthMTkeg7ayIw"
                    }
```

### Users

- Create User

```
  Method: POST

  URL: /api/users/create

  Payload: {
              "firstname":string,
              "lastname":string,
              "password":string
            }

  Response Sample: {
                      "message": "User created successfully",
                      "id":integer,
                      "token":string 
                    }
```

- Authenticate User

```
  Method: POST

  URL: /api/users/authenticate

  Payload: {
              "id":integer,
              "password":string
            }

  Response Sample: {
                      "message": "User created successfully",
                      "id":integer,
                      "token":string 
                    }
```

- Index [token required]

```
  Method: GET

  URL: /api/users/index

  Response Sample: {
                      "message": "User created successfully",
                      "data":[
                                {
                                    "id": integer,
                                    "firstname":string,
                                    "lastname":string
                                }
                              ]
                    }
```

- Show [token required]

```
Method: GET

URL: /api/users/show/:user_id

Response Sample: {
                    "message": "user retrieved successfully",
                    "data": {
                        "id":integer,
                        "firstname":string,
                        "lastname":string
                    }
                  }
```

#### Orders

- Add Product to Order [token required]

```
Method: PUT

URL: /api/orders/addproduct

Payload: {
  product_id:integer,
  order_id:integer,
  price:integer
}

```

- Remove Product from Order by user [token required]

```
Method: DELETE

URL: /api/orders/removeproduct

Payload: {
  product_id:integer,
  order_id:integer,
  price:integer
}

```


- Current Order by user (args: user id)[token required]

```
Method: GET

URL: /api/orders/currentorders/:user_id

```
- Completed Orders by user (args: user id)[token required]

```
Method: GET

URL: /api/orders/completedorders/:user_id

```

- Delete Order by order id (args: order id)[token required]

```
Method: DELETE

URL: /api/orders/delete/:order_id

```

### Products

- Index

```
Method: GET

URL: /api/products/index

```
- Show

```
Method: GET

URL: /api/products/show/:product_id

```
- Create [token required]

```
Method: POST

URL: /api/products/create

Payload: {
            name:string,
            price:integer,
            category:string
          }
```
- Top 5 most popular products

```
Method: GET

URL: /api/products/popular

```
- Products by category (args: product category)

```
Method: GET

URL: /api/products/category?category=provided category

```

## Testing

- run 'npm run test'. This uses migrations to create tables for period of test and drop them after the tests.