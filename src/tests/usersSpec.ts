import supertest from 'supertest';
import app from '../server';
import { json } from 'body-parser';
const request = supertest(app);

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

describe('Testing user API', () => {
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
