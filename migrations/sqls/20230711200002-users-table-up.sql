CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  login varchar(100),
  first_name varchar(100),
  last_name varchar(100),
  password_hash varchar
);