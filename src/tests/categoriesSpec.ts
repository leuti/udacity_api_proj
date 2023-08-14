import supertest from 'supertest';
import app from '../server';
const request = supertest(app);

var token: string;
var userId: number;
let categoryId: string; // variable to hold the newly created categoryId

/* ===============================================================================
Routes in handler: 
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', create); // verifyAuthToken
  app.delete('/categories/:id', destroy); // verifyAuthToken
  // app.post('/categories/:id/products', addProduct); // verifyAuthToken
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
    console.error('Error deleting user:', err);
  }
}

beforeAll(async () => {
  await createUserAndSetToken();
});

afterAll(async () => {
  await deleteUser();
});

describe('Testing categories API', () => {
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
