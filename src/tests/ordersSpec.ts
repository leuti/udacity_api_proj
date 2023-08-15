import supertest from 'supertest';
import app from '../server';
import { Order, OrderProduct, OrderStore } from '../models/orders';

const request = supertest(app);
const store = new OrderStore();

// Token of Test User
var token: string;
var userId: number;
let orderId: string; // variable to hold the newly created orderId

/* ===============================================================================
Routes in handler: 
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create); // verifyAuthToken
  app.delete('/orders/:id', destroy); // verifyAuthToken
  app.post('/orders/:id/products', addProduct); // verifyAuthToken
================================================================================== */

// With this function a new test user is created
async function createUserAndSetToken() {
  try {
    const userData = {
      login: 'test_user',
      firstName: 'Test',
      lastName: 'User',
      password: 'jasmtestusr',
    };

    const response = await request.post('/users').send(userData);
    token = response.body.token;
    userId = response.body.id;
  } catch (err: any) {
    console.error('Error creating user:', err);
  }
}

async function deleteUser() {
  try {
    await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
  } catch (err: any) {
    console.error('Error deleting user:', err);
  }
}

beforeAll(async () => {
  await createUserAndSetToken();
});

afterAll(async () => {
  await deleteUser();
});

describe(`ORDERS\n------------\n\nTesting orders handler`, () => {
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
      .post(`/orders/1/products`)
      .set('Authorization', `Bearer ${token}`)
      .send(orderProductsData); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body.hasOwnProperty('product_id')).toBe(true);
  });
});

describe('Testing order model', () => {
  it('create and index of order', async () => {
    const order: Order = {
      // Order to be created
      userId: 1,
      status: 'test',
    };
    await store.create(order); // Create order in DB

    const orders = await store.index();

    expect(orders.length).toBeGreaterThan(0);
  });

  it('create and show of order', async () => {
    const order: Order = {
      // Order to be created
      userId: 1,
      status: 'test',
    };
    const ord = await store.create(order); // Create order in DB

    if (ord.id !== undefined) {
      // if order was created, the id is returned
      const o = await store.show(ord.id.toString()); // we call the show function to get the order
      expect(o.id).toBe(ord.id);
    } else {
      fail('Order creation failed');
    }
  });

  it('addProduct', async () => {
    const quantity = 123456789;
    const orderId = '1';
    const productId = '1';

    const ordProd = await store.addProduct(quantity, orderId, productId); // Create order in DB

    if (ordProd.id !== undefined) {
      // if orderProduct was created, the id is returned
      expect(quantity).toBe(ordProd.quantity);
    } else {
      fail('Order creation failed');
    }
  });

  it('create and delete of orders', async () => {
    const order: Order = {
      // Order to be created
      userId: 1,
      status: 'test',
    };
    const ord = await store.create(order); // Create order in DB

    if (ord.id !== undefined) {
      // if order was created, the id is returned
      const p = await store.delete(ord.id.toString()); // we call the delete function to get the order
      expect(p.id).toBe(ord.id);
    } else {
      fail('Order creation failed');
    }
  });
});
