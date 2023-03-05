# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

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

- Create [token required]

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
                      "data": {
                          "id":integer
                      }
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