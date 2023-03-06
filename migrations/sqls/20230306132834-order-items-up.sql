CREATE TABLE order_items (id SERIAL PRIMARY KEY, order_id bigint REFERENCES orders(id) ON DELETE CASCADE, product_id bigint REFERENCES products(id) ON DELETE CASCADE, price bigint, quantity int);
