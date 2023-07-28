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

console.log(`ENV=[${ENV?.trim()}]`);

if (ENV?.trim() == 'test') {
  console.log(
    `IM TEST MODUS - database.ts: ENV=[${ENV}] | database = ${POSTGRES_TEST_DB}`
  );
  Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
} else {
  console.log(
    `NICHT IM TEST MODUS: database.ts: ENV=${ENV} | database = ${POSTGRES_DEV_DB}`
  );
  Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DEV_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

export default Client;
