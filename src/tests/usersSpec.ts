import supertest from 'supertest';
import app from '../server';
import { json } from 'body-parser';
const request = supertest(app);

// Token of Test User
const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2dpbiI6InRlc3RfdXNlciIsImZpcnN0X25hbWUiOiJUZXN0IiwibGFzdF9uYW1lIjoiVGVzdCIsInBhc3N3b3JkX2hhc2giOiIkMmIkMTAkM1Fna0QvRnhzR1BLckthLkNaMUs3ZXBlTWxUTHcwU2JwQmRnNDBna0w1djhmWWhJdXFCZWkifSwiaWF0IjoxNjg5NjE3NzM4fQ.RTxSEEswfTMxFo_xaiZzqct0To1lRokFu01Cmh4_N_E';
var deleteToken: string = ''; // get returned token
var userId: string; // variable to hold the newly created userId

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
    userId = '1'; // To be an existing userId
    const response = await request.get(`/users/${userId}`); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.login).toBe('test_user');
  });

  it('GET /users/:id (not existing) --> should return a 400 status', async () => {
    userId = '99999'; // To be a non-existent userId ID
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
    expect(response.body).toBeDefined();
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
    userId = '99999'; // To be a non-existent userId ID
    const response = await request
      .delete(`/users/${userId}`) // Make API call
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
    // Tests
    expect(response.status).toBe(400);
  });

  it('DELETE /users[/:id] (not me) --> should return a 400 status', async () => {
    userId = '2'; // To be a non-existent userId ID
    const response = await request
      .delete(`/users/${userId}`) // Make API call
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
    // Tests
    expect(response.status).toBe(400);
  });
});
