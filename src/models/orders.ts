import Client from '../database';

/* ===============================================================================
Routes in handler: 
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create); // verifyAuthToken
  app.delete('/orders/:id', destroy); // verifyAuthToken
  // app.post('/orders/:id/products', addProduct); // verifyAuthToken
================================================================================== */

export type Order = {
  id?: number;
  userId: number;
  status: string;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id =($1)';

      const result = await conn.query(sql, [id]);

      conn.release();

      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        throw new Error(`order ${id} not existing.`);
      }
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';

      const result = await conn.query(sql, [o.userId, o.status]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not add new order ${o.id}. Error: ${err}`);
    }
  }

  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';

      const result = await conn.query(sql, [quantity, orderId, productId]);

      const order = result.rows[0];
      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';

      const result = await conn.query(sql, [id]);

      const order = result.rows[0];
      conn.release();

      if (order !== undefined) {
        return order;
      } else {
        throw new Error(`order ${id} not existing.`);
      }
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }
}
