# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

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

### Create the following .env file

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=shopping
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=password123
BCRYPT_PASSWORD=29(/%&!Hkyiz1&
SALT_ROUNDS=10
TOKEN_SECRET=KasparIstGross

### Launch the docker file containing the psql database

Run the following command "docker compose up -d"

### Create database

Run the command "db-migrate up"

### test app

npm run test

### run app

npm run build
npm run start
