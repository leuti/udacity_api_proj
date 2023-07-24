INSERT INTO categories (name) 
VALUES 
('Gardening'),
('Kitchen'),
('Outdoor'),
('Food'),
('Beverages');

INSERT INTO users (login, first_name, last_name) 
VALUES 
('test_user', 'test_first_name', 'test_last_name'),
('user1', 'hello', 'user1'),
('user2', 'hello', 'user2');

INSERT INTO products (name, price, category_id) 
VALUES 
('Test Product', 99.99, 1),
('Beer', 1.99, 5),
('Milk', 1.5, 5),
('Yoghurt', 0.99, 5),
('Timber', 99.99, 1),
('Rope 50m', 99.99, 3),
('Pen', 0.59, 1);

INSERT INTO orders (user_id, status) 
VALUES 
(1, 'Ordered'),
(2, 'Cancelled'),
(1, 'Finished'),
(1, 'Ordered'),
(1, 'Ordered');

INSERT INTO order_products (order_id, product_id, quantity)
VALUES
(1, 1, 100),
(1, 2, 500),
(1, 3, 1),
(1, 4, 10),
(2, 3, 100),
(3, 3, 100),
(4, 4, 2),
(5, 5, 1),
(5, 6, 100);