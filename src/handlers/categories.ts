import express, { Request, Response } from 'express';

import { Category, CategoryStore } from '../models/categories';
import verifyAuthToken from '../services/utils';

const store = new CategoryStore();

const categoryRoutes = (app: express.Application) => {
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', verifyAuthToken, create);
  app.delete('/categories/:id', verifyAuthToken, destroy);
  // app.post('/categories/:id/products', addProduct); // utils.verifyAuthToken
};

const index = async (_req: Request, res: Response) => {
  try {
    const categories = await store.index();
    res.json(categories);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const show = async (_req: Request, res: Response) => {
  try {
    const category = await store.show(_req.params.id);
    res.json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

const create = async (_req: Request, res: Response) => {
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
  try {
    const deleted = await store.delete(_req.params.id);
    res.json(deleted);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

export default categoryRoutes;
