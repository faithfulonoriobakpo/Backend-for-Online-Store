CREATE TABLE users (id SERIAL PRIMARY KEY, firstname varchar(20), lastname varchar(25), password varchar(100));
CREATE TABLE products (id SERIAL PRIMARY KEY, name varchar(50), price bigint, category varchar(30));
CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id int REFERENCES users(id) ON DELETE CASCADE, status varchar(12));
CREATE TABLE order_items (id SERIAL PRIMARY KEY, order_id bigint REFERENCES orders(id) ON DELETE CASCADE, product_id bigint REFERENCES products(id) ON DELETE CASCADE, price bigint, quantity int);