import Client from '../database';

// For debugging: load debugLevel from ENV --> if TRUE console.log statements are generated
import dotenv from 'dotenv';
dotenv.config();
const debugLevel: number = parseInt(process.env.DEBUG_LEVEL || '0');
if (debugLevel > 0) {
  console.log(`Debug Level: ${debugLevel}`);
}

export type Category = {
  id?: Number;
  name: String;
};

export class CategoryStore {
  async index(): Promise<Category[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM categories';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error('Could not get categories. Error: ${err}');
    }
  }

  async show(id: string): Promise<Category> {
    try {
      if (debugLevel > 0) {
        console.log(`Category ID: ${id}`);
      }

      const conn = await Client.connect();
      const sql = 'SELECT * FROM categories WHERE id =($1)';

      const result = await conn.query(sql, [id]);

      conn.release();

      if (debugLevel > 0) {
        console.log(`result: ${JSON.stringify(result.rows[0])}`);
      }
      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        throw new Error('Category ${id} not existing.');
      }
    } catch (err) {
      throw new Error('Could not find category ${id}. Error: ${err}');
    }
  }

  async create(c: Category): Promise<Category> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO categories (name) VALUES($1) RETURNING *';

      const result = await conn.query(sql, [c.name]);

      const category = result.rows[0];

      conn.release();

      return category;
    } catch (err) {
      throw new Error('Could not add new category ${title}. Error: ${err}');
    }
  }

  async delete(id: string): Promise<Category> {
    try {
      if (debugLevel > 0) {
        console.log(`ID to be deleted: ${id}`);
      }
      const conn = await Client.connect();
      const sql = 'DELETE FROM categories WHERE id=($1) RETURNING *';

      const result = await conn.query(sql, [id]);

      const category = result.rows[0];
      conn.release();

      if (debugLevel > 0) {
        console.log(`Deleted category: ${category}`);
      }
      if (category !== undefined) {
        return category;
      } else {
        throw new Error('Category ${id} not existing.');
      }
    } catch (err) {
      throw new Error('Could not delete category ${id}. Error: ${err}');
    }
  }
}
