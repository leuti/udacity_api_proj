import express, { Request, Response } from 'express';

import { Category, CategoryStore } from '../models/categories';
import utils from '../services/utils';

const store = new CategoryStore();

// For debugging: load debugLevel from ENV --> if TRUE console.log statements are generated
import dotenv from 'dotenv';
dotenv.config();
const debugLevel: number = parseInt(process.env.DEBUG_LEVEL || '0');
if (debugLevel > 0) {
  console.log(`Debug Level: ${debugLevel}`);
}

const categoryRoutes = (app: express.Application) => {
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', utils.verifyAuthToken, create);
  app.delete('/categories/:id', utils.verifyAuthToken, destroy);
  // app.post('/categories/:id/products', addProduct); // utils.verifyAuthToken
};

const index = async (_req: Request, res: Response) => {
  if (debugLevel > 0) {
    console.log('Handlers categories index reached');
  }
  const categories = await store.index();
  res.json(categories);
};

const show = async (_req: Request, res: Response) => {
  if (debugLevel > 0) {
    console.log('Handlers categories show reached');
  }

  try {
    const category = await store.show(_req.params.id);
    res.json(category);
  } catch (err: any) {
    if (debugLevel > 0) {
      console.log(`Handlers categories show returned error ${err}`);
    }
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const create = async (_req: Request, res: Response) => {
  if (debugLevel > 0) {
    console.log('Handlers categories create reached');
  }
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
  if (debugLevel > 0) {
    console.log('Handlers categories destroy reached');
  }

  try {
    const deleted = await store.delete(_req.params.id);
    res.json(deleted);
  } catch (err: any) {
    if (debugLevel > 0) {
      console.log(`category destroy handler returned ${err}`);
    }
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