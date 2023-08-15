import supertest from 'supertest';
import app from '../server';
import { DashboardQueries } from '../services/dashboard';

const request = supertest(app);
const store = new DashboardQueries();

/* ===============================================================================
Routes in handler: 
  app.get('/most_popular_products', index);
  app.get('/most_expensive_products', index);
================================================================================== */

describe('DASHBOARD\n------------\n\nTesting dashboard handler', () => {
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

describe('Testing dashboard model', () => {
  it('productsInOrders', async () => {
    const response = await store.productsInOrders(); // Make call to function

    // Tests
    expect(response.length).toBeGreaterThan(0);
  });

  it('mostExpensiveProducts', async () => {
    const response = await store.mostExpensiveProducts(); // Make call to function

    // Tests
    expect(response.length).toBeGreaterThan(0);
  });
});
