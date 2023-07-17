import Client from '../database';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import utils from '../services/utils';

const pepper: string = process.env.BCRYPT_PASSWORD || '';
const saltRounds: number = parseInt(process.env.SALT_ROUNDS || '0');

if (utils.debugLevel > 0) {
  console.log(`Debug Level: ${utils.debugLevel}`);
}

export type User = {
  id?: string;
  login: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
};

dotenv.config();

export class UserStore {
  // List all users in database
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get users: ${err}`);
    }
  }

  // List details for specific user
  async show(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to show user ${id}: ${err}`);
    }
  }

  // Create new user
  async create(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (login, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';

      const hash = bcrypt.hashSync(u.passwordHash + pepper, saltRounds);
      if (utils.debugLevel > 0) {
        console.log(`User model reached with user ${u.login} and ${hash}`);
      }

      const result = await conn.query(sql, [
        u.login,
        u.firstName,
        u.lastName,
        hash,
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Unable to create user (${u.login}): ${err}`);
    }
  }

  // Delete given user
  async delete(id: string, token: string): Promise<User> {
    try {
      if (utils.debugLevel > 0) {
        console.log(`Deleting user with ID ${id} and token ${token}`);
      }

      const conn = await Client.connect();

      const sql1 = 'SELECT password_hash FROM users WHERE id=($1)'; // instead of comparing the password_hash_digest I would just compare the user ID in the token.
      const result_select = await conn.query(sql1, [id]);

      const passwordHashStored = result_select.rows[0].password_hash;

      if (utils.debugLevel > 0) {
        console.log(`passwordHash: ${passwordHashStored}`);
      }

      const decoded: JwtPayload = jwt.verify(
        token,
        process.env.TOKEN_SECRET as Secret
      ) as JwtPayload;

      if (utils.debugLevel > 0) {
        console.log(`decoded: ${JSON.stringify(decoded.user.password_hash)}`);
      }

      if (passwordHashStored === decoded.user.password_hash) {
        if (utils.debugLevel > 0) {
          console.log('You are allowed to delete user');
        }
        const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';

        const result = await conn.query(sql, [id]);

        const user = result.rows[0];

        conn.release();
        return user;
      } else {
        if (utils.debugLevel > 0) {
          console.log('not allowed to delete');
        }
        throw new Error(
          `Delete user NOT allowed. You can only delete your user.`
        );
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async authenticate(
    login: string,
    passwordHash: string
  ): Promise<User | null> {
    const conn = await Client.connect();
    const sql = 'SELECT passwordHash FROM users WHERE login=($1)';

    const result = await conn.query(sql, [login]);

    if (utils.debugLevel > 0) {
      console.log(passwordHash + pepper);
    }

    if (result.rows.length) {
      const user = result.rows[0];

      if (utils.debugLevel > 0) {
        console.log(user);
      }

      if (bcrypt.compareSync(passwordHash + pepper, user.passwordHash)) {
        return user;
      }
    }

    return null;
  }
}
