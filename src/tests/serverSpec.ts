import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('Test endpoint categories responsed ', () => {
  it('gets the categories index endpoint', async (done) => {
    const response = await request.get('/categories');
    expect(response.status).toBe(200);
    done();
  });
});
