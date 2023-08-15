import Client from '../database';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const pepper: string = process.env.BCRYPT_PASSWORD || '';
const saltRounds: number = parseInt(process.env.SALT_ROUNDS || '0');

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
      throw err;
    }
  }

  // List details for specific user
  async show(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';

      const result = await conn.query(sql, [id]);

      conn.release();

      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        throw new Error('User ${id} not existing.');
      }
    } catch (err) {
      throw new Error(`Could not find User ${id}. Error: ${err}`);
    }
  }

  // Create new user
  async create(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (login, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';

      const hash = bcrypt.hashSync(u.passwordHash + pepper, saltRounds);

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
      throw err;
    }
  }

  // Delete given user
  async delete(id: string, token: string): Promise<User> {
    try {
      const conn = await Client.connect();

      // First select the password_hash for give user
      const sql1 = 'SELECT password_hash FROM users WHERE id=($1)'; // Improvement: instead of comparing password_hash_digest I would just compare the user ID in the token
      const result_select = await conn.query(sql1, [id]);

      // Throw error if user with given id is not found
      if (!result_select.rows || result_select.rows.length === 0) {
        throw new Error(`User with id ${id} not found`);
      }

      const passwordHashStored = result_select.rows[0].password_hash; // store password_hash from the db

      // decode the token provided by the client
      const decoded: JwtPayload = jwt.verify(
        token,
        process.env.TOKEN_SECRET as Secret
      ) as JwtPayload;

      // compare the password_hash from the DB with the hash provided by the client --> only if both match the user can be deleted
      if (passwordHashStored === decoded.user.password_hash) {
        const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
        const result = await conn.query(sql, [id]);

        const user = result.rows[0];

        conn.release();
        return user;
      } else {
        throw new Error(
          `Delete user NOT allowed. You can only delete your user.`
        );
      }
    } catch (err) {
      throw err;
    }
  }

  // Authenticate user --> Return password_hash if authorized; else null
  async authenticate(login: string, password: string): Promise<User | null> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE login=($1)';

    const result = await conn.query(sql, [login]);

    if (result.rows.length) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password + pepper, user.password_hash)) {
        // check if provided password and pepper match password_hash stored in DB
        return user;
      }
    }

    return null;
  }
}
