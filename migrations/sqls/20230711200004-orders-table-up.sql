CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id integer REFERENCES products(id),
  quantity integer,
  user_id integer REFERENCES users(id),
  status varchar(10)
)
