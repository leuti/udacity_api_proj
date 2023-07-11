CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  price numeric(10,2),
  category_id integer references categories(id)
);