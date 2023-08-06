import supertest from 'supertest';
import app from '../server';
const request = supertest(app);

var token: string;
var userId: number;
let productId: string; // variable to hold the newly created productId

/* ===============================================================================
Routes in handler: 
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create); // verifyAuthToken
  app.delete('/products/:id', destroy); // verifyAuthToken
  // app.post('/products/:id/products', addProduct); // verifyAuthToken
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
    const response = await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
  } catch (err: any) {
    console.error('Error delete user:', err);
  }
}

beforeAll(async () => {
  await createUserAndSetToken();
});

afterAll(async () => {
  await deleteUser();
});

describe('Testing products API', () => {
  it('GET /products --> gets the products index endpoint', async () => {
    const response = await request.get('/products'); // Make API call

    // Tests
    expect(response.status).toBe(200);
  });

  it('GET /products/:id (existing) --> should return the product with the given id', async () => {
    const productId = '1'; // To be an existing product
    const response = await request.get(`/products/${productId}`); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe('Test Product');
  });

  it('GET /products/:id (not existing) --> should return a 400 status if the product does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent product ID
    const response = await request.get(`/products/${nonExistentId}`); // Make the POST request

    // Tests
    expect(response.status).toBe(400);
  });

  it('POST /products[/:id] --> should create a new product', async () => {
    // Create test data
    const productData = {
      name: 'Test Product',
      price: 99.99,
      categoryId: 1,
    };

    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(productData); // Make API call

    productId = response.body.id; // generated catetory id

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /products[/:id] (existing) --> should delete test product', async () => {
    const response = await request
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers

    // Tests
    expect(response.status).toBe(200);
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('DELETE /products[/:id] (not existing) --> should return a 400 status if the product does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent product ID
    const response = await request
      .delete(`/products/${nonExistentId}`) // Make API call
      .set('Authorization', `Bearer ${token}`); // Pass the token in the headers
    // Tests
    expect(response.status).toBe(400);
  });
});
