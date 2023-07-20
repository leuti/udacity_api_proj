import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User, UserStore } from '../models/users';
import verifyAuthToken from '../services/utils';

const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.delete('/users/:id', verifyAuthToken, destroy);
  app.post('/users/authenticate', authenticate);
};

const store = new UserStore();

// List all users in database
const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

// List details for specific user
const show = async (_req: Request, res: Response) => {
  try {
    const user = await store.show(_req.params.id);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

// Create new user
const create = async (req: Request, res: Response) => {
  const user: User = {
    login: req.body.login,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    passwordHash: req.body.password,
  };

  try {
    const newUser = await store.create(user);
    var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
    res.json({ id: newUser.id, token: token });
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

// Delete given user
const destroy = async (_req: Request, res: Response) => {
  const authorisationHeader = _req.headers.authorization;
  const token = authorisationHeader?.split(' ')[1];

  try {
    const deleted = await store.delete(_req.params.id, token ?? '');
    res.json(deleted);
  } catch (err: any) {
    res.status(400).json({ error: err.message }); // Return error message as JSON
  }
};

// Authenticate user
const authenticate = async (_req: Request, res: Response) => {
  const user: User = {
    login: _req.body.login,
    firstName: _req.body.firstName,
    lastName: _req.body.lastName,
    passwordHash: _req.body.password,
  };
  try {
    const u = await store.authenticate(user.login, user.passwordHash);
    res.json(u);
  } catch (err: any) {
    res.status(401).json({ error: err.message }); // Return error message as JSON
  }
};

export default userRoutes;
