import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DEV_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
} = process.env;

let Client: Pool;

if (ENV?.trim() == 'test') {
  // trim is used to ensure trailing spaces are removed
  Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  console.log(
    `Starting database: ENV=[${ENV}] | database = ${POSTGRES_TEST_DB}`
  );
} else {
  Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DEV_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  console.log(
    `Starting database: ENV=[${ENV}] | database = ${POSTGRES_DEV_DB}`
  );
}

export default Client;
