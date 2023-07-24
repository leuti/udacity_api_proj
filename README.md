# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API.

## Required Technologies

This application makes use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- bcrypt to hash and compare passwords
- jasmine from npm for testing (incl. supertest for API testing)

## Steps to Completion

### Source location

https://github.com/leuti/udacity_api_proj.git

### Create the following .env file in the root folder of this project

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=shopping
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=password123
BCRYPT_PASSWORD=29(/%&!Hkyiz1&
SALT_ROUNDS=10
TOKEN_SECRET=KasparIstGross

### Create the following database.json file in the root folder of this project

{
"dev": {
"driver": "pg",
"host": "127.0.0.1",
"database": "shopping",
"user": "shopping_user",
"password": "password123"
},
"test": {
"driver": "pg",
"host": "127.0.0.1",
"database": "shopping",
"user": "shopping_user",
"password": "password123"
}
}

### Install all packages

Run the command "npm install" to install all required packages.

### Launch the docker file containing the psql database

Run the following command "docker compose up -d"
The psql server will start on port 5432.

### Create database

Run the command "db-migrate up"

### test app

npm run test

### run app

npm run build
npm run start
(alternative: npm run watch)
