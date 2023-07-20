import Client from '../database';

/* ===============================================================================
Routes in handler: 
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create); // verifyAuthToken
  app.delete('/products/:id', destroy); // verifyAuthToken
  // app.post('/products/:id/products', addProduct); // verifyAuthToken
================================================================================== */

export type Product = {
  id?: number;
  name: string;
  price: number;
  categoryId: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id =($1)';

      const result = await conn.query(sql, [id]);

      conn.release();

      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        throw new Error('Product ${id} not existing.');
      }
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO products (name, price, category_id) VALUES($1, $2, $3) RETURNING *';

      const result = await conn.query(sql, [p.name, p.price, p.categoryId]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];
      conn.release();

      if (product !== undefined) {
        return product;
      } else {
        throw new Error('Product ${id} not existing.');
      }
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
