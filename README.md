# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app for a store

## Required modules

This application makes use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- bcrypt to hash an
  d compare passwords
- jasmine from npm for testing (incl. supertest for API testing)
- cross-env to start app in different environments independent of the OS

## Steps to installation

### 1. Download source and install locally

git clone https://github.com/leuti/udacity_api_proj.git

### Create the following .env file in the root folder of this project (this information would normally not be exposed in a README file)

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=postgres
POSTGRES_DEV_DB=shopping_dev
POSTGRES_TEST_DB=shopping_test
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=password123
BCRYPT_PASSWORD=29(/%&!Hkyiz1&
SALT_ROUNDS=10
TOKEN_SECRET=KasparIstGross_test
ENV=test

### Create the following database.json file in the root folder of this project (this information would normally not be exposed in a README file)

{
"dev": {
"driver": "pg",
"host": "127.0.0.1",
"database": "shopping_dev",
"user": "shopping_user",
"password": "password123"
},
"test": {
"driver": "pg",
"host": "127.0.0.1",
"database": "shopping_test",
"user": "shopping_user",
"password": "password123"
}
}

### IMPORTANT: Ensure End of Line Sequence is correct

On my Windows machine I have to ensure that the End of Line Sequence for file "docker-entrypoint-initdb.d\init-db.sh" is set to LF. I have done this using VSCode. Proposals for a better solution to create the two shopping database at the beginning are welcomed.

### Install all packages

- Run the command "npm install" to install all required packages.

### Launch the docker file containing the psql database

- Run the following command "docker compose up -d"
- The psql server will start on port 5432
- Note: during the creation of my psql docker container I am creating two databases. This is done with the script init-db.sh located in the directory docker-entrypoint-initdb.d

## Launch app in different modes

### Run jasmine test cases only

- Run the command "npm run test"

### Run app in test mode

- Change the .env param ENV to test
- Run the command "npm run start" or alternatively the "npm run watch"

### Run app in dev mode

- Change the .env param ENV to dev
- Run the command "npm run start" or alternatively the "npm run watch"

## All scripts described:

- npm run start: compiles the source files, creates (if required the necessary tables and insert the test data) and start the app (the .env ENV variable defines which env to start)
- npm run watch: runs the app in watch mode, meaning that any code change immediately leads to a re-start of the app (ENV var considered)
- npm run test: compliles the source files, creates (if required the necessary tables and insert the test data) and runs the jasmine test cases in test env
- npm run test:drop: same as above, but drops all tables previously created
- npm run build: builds the runtime code
- npm run jasmine: runs the jasmine test scripts

## Some docker commands

- "docker stop proj_pg-postgres-1" stops the container
- "docker rm proj_pg-postgres-1" removes the container
- "docker volume rm proj_pg_postgres" removes the docker volume
- "docker ps" will list running containers
- "docker volume ls" lists all volumes
