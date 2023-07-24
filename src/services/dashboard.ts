import Client from '../database';

export class DashboardQueries {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<
    { name: string; price: number; order_id: string }[]
  > {
    try {
      console.log(`dashboard service productsInOrders reached`);
      const conn = await Client.connect();
      const sql =
        'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.id';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products and orders: ${err}`);
    }
  }

  // Get 5 most expensive products
  async mostExpensiveProducts(): Promise<{ name: string; price: number }[]> {
    try {
      console.log(`dashboard service mostExpensiveProducts reached`);
      const conn = await Client.connect();
      const sql =
        'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get most expensive products: ${err}`);
    }
  }
}
