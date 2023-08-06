import express, { Request, Response } from 'express';

import { DashboardQueries } from '../services/dashboard';

const dashboardRoutes = (app: express.Application) => {
  app.get('/most_popular_products', productsInOrders);
  app.get('/most_expensive_products', mostExpensiveProducts);
};

const dashboard = new DashboardQueries();

const productsInOrders = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.productsInOrders();
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const mostExpensiveProducts = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.mostExpensiveProducts();
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

export default dashboardRoutes;
