import supertest from 'supertest';
import app from '../server';
const request = supertest(app);

/* ===============================================================================
Routes in handler: 
  app.get('/most_popular_products', index);
  app.get('/most_expensive_products', index);
================================================================================== */

describe('Testing dashboard API', () => {
  it('GET /most_popular_products --> 5 most popular products', async () => {
    const response = await request.get('/most_popular_products'); // Make API call

    // Tests
    expect(response.status).toBe(200);
  });

  it('GET /most_expensive_products --> get 5 most expensive products', async () => {
    const response = await request.get(`/most_expensive_products`); // Make API call

    // Tests
    expect(response.status).toBe(200);
  });
});
