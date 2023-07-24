# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products

- Index --> Route: products [Get]
- Show --> Route: products/:id [Get]
- Create [token required] (args: name, price categoryId) --> Route: products [Post]
- Delete [token required] --> Route: products/:id [Delete]
- Top 5 most popular products --> Route: most_popular_products [Get] (in model dashboard)
- Products by category (args: product_category_id) --> Route: products_by_category [Get]

### Categories

- Index --> Route: categories [Get]
- Show --> Route: categories/:id [Get]
- Create [token required] (args: ) --> Route: categories [Post]
- Delete [token required] --> Route: cagegories [Delete]

### Users

- Index [token required] --> Route: users [Get]
- Show [token required] --> Route: users/:id [Get]
- Create [token required] (args: login, firstName, LastName, password) --> Route: users [Post]
- Delete [token required] --> Route: users/:id [Delete]
- Authenticate [token required] --> Route users/authenticate [post]

### Orders

- Index [token required] --> Route: orders [Get]
- Show [token required] --> Route: orders/:id [Get]
- Create [token required] (args: userId, status) --> Route: orders [Post]
- Delete [token required] --> Route: orders/:id [Delete] // only own order can be deleted; order products entries are deleted at the same time
- Current Order by user [token required] (args: user id)
- Completed Orders by user [token required] (args: user id)

### Order Products

- Create [token required] (args: orderId, productId, quantity) --> Route: orders/:id/products [Post]
- Delete [token required] --> Route: orders/:id/products/:id [Delete] // only delete specific order products items

### Dashboard

- Get (most popular ordered products) --> Route: most_popular_products [Get]
- Get (most expensive products) --> Route: most_expensive_products [Get]

## Data Shapes

### Products

- id
- name
- price
- category id

### Category

- id
- name

### User

- id
- login
- first name
- last name
- password (hashed)

### Orders

- id
- user id
- status of order (active or complete)

## Table Structure

### Category

Table: categories (
id: [Unique Key],
name: varchar(50)
)

### User

Table: users (
id: [Unique Key],
login: varchar(100),
first_name: varchar(100),
last_name: varchar(100),
password_hash: varchar
)

### Products

Table: products (
id: [Unique Key],
name: varchar(255),
price: numeric(10,2),
category_id: integer [foreign key to category table]
)

### Orders

Table: orders (
id: [Unique Key],
user_id: integer [foreign key to users table],
status: varchar(10)
)

### Order Product

Table: order_products (
id: [Unique Key],
order_id: integer [foreign key to orders table],
product_id: integer [foreign key to products table],
quantity: integer
)
