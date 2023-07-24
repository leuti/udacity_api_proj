INSERT INTO categories (name) VALUES ('Gardening');
INSERT INTO users (login, first_name, last_name) VALUES ('test_user', 'test_first_name', 'test_last_name');
INSERT INTO products (name, price, category_id) VALUES ('Test Product', 99.99, 1);
INSERT INTO orders (product_id, user_id, status) VALUES (1, 1, 'Ordered');
