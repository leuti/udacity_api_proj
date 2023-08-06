import express, { Request, Response } from 'express';

import { Order, OrderStore } from '../models/orders';
import verifyAuthToken from '../services/utils';

const store = new OrderStore();

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', verifyAuthToken, create);
  app.delete('/orders/:id', verifyAuthToken, destroy);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
};

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const show = async (_req: Request, res: Response) => {
  try {
    const order = await store.show(_req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const create = async (_req: Request, res: Response) => {
  try {
    const order: Order = {
      userId: _req.body.userId,
      status: _req.body.status,
    };

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const destroy = async (_req: Request, res: Response) => {
  try {
    const deleted = await store.delete(_req.params.id);
    res.json(deleted);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const addProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.orderId;
  const productId: string = _req.body.productId;
  const quantity: number = parseInt(_req.body.quantity);

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

export default orderRoutes;
