import express, { Request, Response } from 'express';

import { DashboardQueries } from '../services/dashboard';

const dashboardRoutes = (app: express.Application) => {
  app.get('/most_popular_products', productsInOrders);
  app.get('/most_expensive_products', mostExpensiveProducts);
};

const dashboard = new DashboardQueries();

const productsInOrders = async (_req: Request, res: Response) => {
  console.log('Hallo productsInOrders');
  const products = await dashboard.productsInOrders();
  res.json(products);
};

const mostExpensiveProducts = async (_req: Request, res: Response) => {
  console.log('Hallo mostExpensiveProducts');
  const products = await dashboard.mostExpensiveProducts();
  res.json(products);
};

export default dashboardRoutes;
