import supertest from 'supertest';
import app from '../server';
import { json } from 'body-parser';
import { User, UserStore } from '../models/users';
import jwt from 'jsonwebtoken';

const request = supertest(app);
const store = new UserStore();

var token: string;
var userId: number = 1;
var deleteToken: string = ''; // get returned token

/* ===============================================================================
Routes in handler: 
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create); // verifyAuthToken
  app.delete('/users/:id', destroy); // verifyAuthToken
  // app.post('/users/:id/products', addProduct); // verifyAuthToken
================================================================================== */

describe('USERS\n------------\n\nTesting user handlers', () => {
  it('GET /users --> gets the users index endpoint', async () => {
    const response = await request.get('/users'); // Make API call

    // Tests
    expect(response.status).toBe(200);
  });

  it('GET /users/:id (existing) --> should return the userId with the given id', async () => {
    const response = await request.get(`/users/${userId}`); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body.login).toBe('test_user');
  });

  it('GET /users/:id (not existing) --> should return a 400 status', async () => {
    userId = 99999; // To be a non-existent userId ID
    const response = await request.get(`/users/${userId}`); // Make the POST request

    // Tests
    expect(response.status).toBe(400);
  });

  it('POST /users[/:id] --> should create a new userId', async () => {
    // Create test data
    const userData = {
      login: 'crt_user',
      firstName: 'Jasmin',
      lastName: 'Test User',
      password: 'jasmtestusr',
    };

    const response = await request
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userData); // Make API call

    userId = response.body.id; // generated catetory id
    deleteToken = response.body.token; // store token of created users (to be deleted again)

    // Tests
    expect(response.status).toBe(200);
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /users[/:id] (my user) --> should delete test userId', async () => {
    const response = await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${deleteToken}`); // Pass the token in the headers

    // Tests
    expect(response.status).toBe(200);
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /users[/:id] (not existing) --> should return a 400 status', async () => {
    userId = 99999; // To be a non-existent userId ID
    const response = await request
      .delete(`/users/${userId}`) // Make API call
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
    // Tests
    expect(response.status).toBe(401);
  });

  it('DELETE /users[/:id] (not me) --> should return a 400 status', async () => {
    userId = 2; // To be a non-existent userId ID
    const response = await request
      .delete(`/users/${userId}`) // Make API call
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
    // Tests
    expect(response.status).toBe(401);
  });
});

describe('Testing user models', () => {
  it('create and index of users', async () => {
    const user: User = {
      // User to be created
      login: 'test',
      firstName: 'Test',
      lastName: 'Test',
      passwordHash: 'test123',
    };
    await store.create(user); // Create product in DB

    const users = await store.index();

    expect(users.length).toBeGreaterThan(0);
  });

  it('create and show of user', async () => {
    const user: User = {
      // User to be created
      login: 'test',
      firstName: 'Test',
      lastName: 'Test',
      passwordHash: 'test123',
    };
    const usr = await store.create(user); // Create product in DB

    if (usr.id !== undefined) {
      // if product was created, the id is returned
      const u = await store.show(usr.id.toString()); // we call the show function to get the prod
      expect(u.id).toBe(usr.id);
    } else {
      fail('User creation failed');
    }
  });

  it('create, authenticate and delete of users', async () => {
    const user: User = {
      // User to be created
      login: 'testmodel',
      firstName: 'Test',
      lastName: 'Test',
      passwordHash: 'test123',
    };

    const usr = await store.create(user); // Create user in DB
    var token = jwt.sign({ user: usr }, process.env.TOKEN_SECRET as string); // generate token for created user

    if (usr.id !== undefined) {
      // if user was created, the id is returned
      const u = await store.delete(usr.id.toString(), token); // we call the delete function to get the prod
      expect(u.id).toBe(usr.id);
    } else {
      fail('Product creation failed');
    }
  });
});
