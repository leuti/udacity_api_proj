import supertest from 'supertest';
import app from '../server';
const request = supertest(app);

// Token of Test User
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2dpbiI6InRlc3RfdXNlciIsImZpcnN0X25hbWUiOiJUZXN0IiwibGFzdF9uYW1lIjoiVGVzdCIsInBhc3N3b3JkX2hhc2giOiIkMmIkMTAkM1Fna0QvRnhzR1BLckthLkNaMUs3ZXBlTWxUTHcwU2JwQmRnNDBna0w1djhmWWhJdXFCZWkifSwiaWF0IjoxNjg5NjE3NzM4fQ.RTxSEEswfTMxFo_xaiZzqct0To1lRokFu01Cmh4_N_E';

let categoryId: string; // variable to hold the newly created categoryId

/* ===============================================================================
Routes in handler: 
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', create); // verifyAuthToken
  app.delete('/categories/:id', destroy); // verifyAuthToken
  // app.post('/categories/:id/products', addProduct); // verifyAuthToken
================================================================================== */

describe('Testing catgories API', () => {
  it('GET /categories --> gets the categories index endpoint', async () => {
    const response = await request.get('/categories'); // Make API call

    // Tests
    expect(response.status).toBe(200);
  });

  it('GET /categories/:id (existing) --> should return the category with the given id', async () => {
    const categoryId = '1'; // To be an existing category
    const response = await request.get(`/categories/${categoryId}`); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe('Gardening');
  });

  it('GET /categories/:id (not existing) --> should return a 400 status if the category does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent category ID
    const response = await request.get(`/categories/${nonExistentId}`); // Make the POST request

    // Tests
    expect(response.status).toBe(400);
  });

  it('POST /categories[/:id] --> should create a new category', async () => {
    // Create test data
    const categoryData = {
      name: 'Test Category',
    };

    const response = await request
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(categoryData); // Make API call

    categoryId = response.body.id; // generated catetory id

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /categories[/:id] --> should delete test category', async () => {
    const response = await request
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers

    // Tests
    expect(response.status).toBe(200);
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /categories[/:id] (not existing) --> should return a 400 status if the category does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent category ID
    const response = await request
      .delete(`/categories/${nonExistentId}`) // Make API call
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
    // Tests
    expect(response.status).toBe(400);
  });
});
