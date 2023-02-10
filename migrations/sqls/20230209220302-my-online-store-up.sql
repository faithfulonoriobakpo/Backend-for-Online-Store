CREATE TABLE users (id SERIAL PRIMARY KEY, firstname varchar(20), lastname varchar(25), password varchar(30));
CREATE TABLE products (id SERIAL PRIMARY KEY, name varchar(50), price varchar(15), category varchar(30));
CREATE TABLE orders (id SERIAL PRIMARY KEY, id_of_products text [], quantity_of_each_product text [], user_id int REFERENCES users(id), status varchar(12));
