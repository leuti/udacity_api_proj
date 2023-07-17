import supertest from 'supertest';
import app from '../server';
const request = supertest(app);

// For debugging: load debugLevel from ENV --> if TRUE console.log statements are generated
import dotenv from 'dotenv';
dotenv.config();
const debugLevel: number = parseInt(process.env.DEBUG_LEVEL || '0');
if (debugLevel > 0) {
  console.log(`Debug Level: ${debugLevel}`);
}

/*
Routes in handler: 
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', create); // verifyAuthToken
  app.delete('/categories/:id', destroy); // verifyAuthToken
  // app.post('/categories/:id/products', addProduct); // verifyAuthToken
*/

/*
Token für Test User:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2dpbiI6InRlc3RfdXNlciIsImZpcnN0X25hbWUiOiJUZXN0IiwibGFzdF9uYW1lIjoiVGVzdCIsInBhc3N3b3JkX2hhc2giOiIkMmIkMTAkM1Fna0QvRnhzR1BLckthLkNaMUs3ZXBlTWxUTHcwU2JwQmRnNDBna0w1djhmWWhJdXFCZWkifSwiaWF0IjoxNjg5NjE3NzM4fQ.RTxSEEswfTMxFo_xaiZzqct0To1lRokFu01Cmh4_N_E
*/

describe('GET /categories', () => {
  it('gets the categories index endpoint', async () => {
    const response = await request.get('/categories'); // Make API call

    // Tests
    expect(response.status).toBe(200);
  });
});

describe('GET /categories/:id', () => {
  it('should return the category with the given id', async () => {
    const categoryId = '1'; // To be an existing category
    const response = await request.get(`/categories/${categoryId}`); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.name).toBe('Gardening');
  });

  it('should return a 400 status if the category does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent category ID
    const response = await request.get(`/categories/${nonExistentId}`); // Make the POST request

    // Tests
    expect(response.status).toBe(400);
  });
});

describe('POST+DELETE /categories[/:id]', () => {
  let categoryId: string; // variable to hold the newly created categoryId

  it('should create a new category', async () => {
    // Create test data
    const categoryData = {
      name: 'Test Category',
    };

    const response = await request.post('/categories').send(categoryData); // Make API call

    categoryId = response.body.id; // generated catetory id
    if (debugLevel > 0) {
      console.log(`category POST returned categoryId ${categoryId}`);
    }

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('should delete test category', async () => {
    const response = await request.delete(`/categories/${categoryId}`); // Make API call

    // Tests
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.hasOwnProperty('id')).toBe(true);
  });

  it('should return a 400 status if the category does not exist', async () => {
    const nonExistentId = '99999'; // To be a non-existent category ID
    const response = await request.delete(`/categories/${nonExistentId}`); // Make API call

    // Tests
    expect(response.status).toBe(400);
  });
});
