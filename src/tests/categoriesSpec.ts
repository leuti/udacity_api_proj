import supertest from 'supertest';
import app from '../server';
import { Category, CategoryStore } from '../models/categories';

const request = supertest(app);
const store = new CategoryStore();

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

describe('CATEGORIES\n------------\n\nTesting categories handler', () => {
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

  describe('Testing category model', () => {
    it('create and index of category', async () => {
      // Category to be created
      const category: Category = {
        name: 'Test Category',
      };

      await store.create(category); // Create product in DB

      const categories = await store.index();

      expect(categories.length).toBeGreaterThan(0);
    });
  });

  it('create and show of category', async () => {
    const category: Category = {
      name: 'Test Category',
    };
    const categ = await store.create(category); // Create product in DB

    if (categ.id !== undefined) {
      // if product was created, the id is returned
      const c = await store.show(categ.id.toString()); // we call the show function to get the prod
      expect(c.id).toBe(categ.id);
    } else {
      fail('Category creation failed');
    }
  });

  it('create and delete of products', async () => {
    const category: Category = {
      name: 'Test Category',
    };
    const categ = await store.create(category); // Create product in DB

    if (categ.id !== undefined) {
      // if product was created, the id is returned
      const c = await store.delete(categ.id.toString()); // we call the delete function to get the prod
      expect(c.id).toBe(categ.id);
    } else {
      fail('Product creation failed');
    }
  });
});
