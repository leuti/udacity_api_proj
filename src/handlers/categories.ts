import express, { Request, Response } from 'express';

import { Category, CategoryStore } from '../models/categories';
//import verifyAuthToken from '../services/utils';

const store = new CategoryStore();

const categoryRoutes = (app: express.Application) => {
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', create); // verifyAuthToken
  app.delete('/categories/:id', destroy); // verifyAuthToken
  // app.post('/categories/:id/products', addProduct); // verifyAuthToken
};

const index = async (_req: Request, res: Response) => {
  console.log('Handlers categories index reached');
  const categories = await store.index();
  res.json(categories);
};

const show = async (_req: Request, res: Response) => {
  console.log('Handlers categories show reached');

  try {
    const category = await store.show(_req.params.id);
    res.json(category);
  } catch (err: any) {
    console.log(`Handlers categories show returned error ${err}`);
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const create = async (_req: Request, res: Response) => {
  console.log('Handlers categories create reached');
  try {
    const category: Category = {
      name: _req.body.name,
    };

    const newCategory = await store.create(category);
    res.json(newCategory);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const destroy = async (_req: Request, res: Response) => {
  console.log('Handlers categories destroy reached');
  try {
    const deleted = await store.delete(_req.params.id);
    res.json(deleted);
  } catch (err: any) {
    console.log(`category destroy handler returned ${err}`);
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

/*
const addProduct = async (_req: Request, res: Response) => {
  const categoryId: string = _req.params.id;
  const productId: string = _req.body.productId;
  const quantity: number = parseInt(_req.body.quantity);

  try {
    const addedProduct = await store.addProduct(
      quantity,
      categoryId,
      productId
    );
    res.json(addedProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};
*/

export default categoryRoutes;
