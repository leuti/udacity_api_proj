import supertest from 'supertest';
import app from '../server';
const request = supertest(app);

// Token of Test User
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2dpbiI6InRlc3RfdXNlciIsImZpcnN0X25hbWUiOiJUZXN0IiwibGFzdF9uYW1lIjoiVGVzdCIsInBhc3N3b3JkX2hhc2giOiIkMmIkMTAkM1Fna0QvRnhzR1BLckthLkNaMUs3ZXBlTWxUTHcwU2JwQmRnNDBna0w1djhmWWhJdXFCZWkifSwiaWF0IjoxNjg5NjE3NzM4fQ.RTxSEEswfTMxFo_xaiZzqct0To1lRokFu01Cmh4_N_E';

let orderId: string; // variable to hold the newly created orderId
let orderProductsId: string; // variable to hold newly created orderProductsId

/* ===============================================================================
Routes in handler: 
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create); // verifyAuthToken
  app.delete('/orders/:id', destroy); // verifyAuthToken
  app.post('/orders/:id/products', addProduct); // verifyAuthToken
================================================================================== */

describe('Testing orders API', () => {
  it('GET /orders --> gets the orders index endpoint', async () => {
    const response = await request.get('/orders'); // Make API call

    // Tests
    expect(response.status).toBe(200);
  });

  it('GET /orders/:id (existing) --> should return the order with the given id', async () => {
    const orderId = '1'; // To be an existing order
    const response = await request.get(`/orders/${orderId}`); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.status).toBe('Ordered');
  });

  it('GET /orders/:id (not existing) --> should return a 400 status if the order does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent order ID
    const response = await request.get(`/orders/${nonExistentId}`); // Make the POST request

    // Tests
    expect(response.status).toBe(400);
  });

  it('POST /orders[/:id] --> should create a new order', async () => {
    // Create test data
    const orderData = {
      productId: 1,
      userId: 1,
      status: 'Ordered',
    };

    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData); // Make API call

    orderId = response.body.id; // generated catetory id

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /orders[/:id] --> should delete test order', async () => {
    const response = await request
      .delete(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers

    // Tests
    expect(response.status).toBe(200);
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /orders[/:id] (not existing) --> should return a 400 status if the order does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent order ID
    const response = await request
      .delete(`/orders/${nonExistentId}`) // Make API call
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
    // Tests
    expect(response.status).toBe(400);
  });

  it('POST /orders/:id/products (existing) --> should add new order_products record', async () => {
    // Create test data
    const orderProductsData = {
      orderId: '1',
      productId: '1',
      quantity: 2,
    };

    const response = await request
      .post(`/orders/${orderId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .send(orderProductsData); // Make API call

    orderProductsId = response.body.id; // generated orderProductsId

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.hasOwnProperty('product_id')).toBe(true);
  });

  it('POST /orders/:id/products (notexisting) --> should add new order_products record', async () => {});
});
