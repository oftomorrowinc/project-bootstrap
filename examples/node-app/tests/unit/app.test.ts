import request from 'supertest';
import app from '../../src/app.js';

describe('App', () => {
  it('should serve the home page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return time from API endpoint', async () => {
    const response = await request(app).get('/api/time');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('time');
    expect(response.body).toHaveProperty('message');
  });
});
