import express, { Request, Response } from 'express';

import { Product, ProductStore } from '../models/products';
import verifyAuthToken from '../services/utils';

const store = new ProductStore();

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products/:id', verifyAuthToken, destroy);
  // app.post('/products/:id/products', addProduct); // utils.verifyAuthToken
};

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (_req: Request, res: Response) => {
  try {
    const product = await store.show(_req.params.id);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const create = async (_req: Request, res: Response) => {
  try {
    const product: Product = {
      name: _req.body.name,
      price: _req.body.price,
      categoryId: _req.body.categoryId,
    };

    const newuser = await store.create(product);
    res.json(newuser);
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

/*
const addProduct = async (_req: Request, res: Response) => {
  const userId: string = _req.params.id;
  const productId: string = _req.body.productId;
  const quantity: number = parseInt(_req.body.quantity);

  try {
    const addedProduct = await store.addProduct(
      quantity,
      userId,
      productId
    );
    res.json(addedProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};
*/

export default productRoutes;
