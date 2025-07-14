import request from 'supertest';
import app from'../app';

describe('Auth API', () => {
  it('should sign up a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Test1234'
    });
    console.log('Signup Response:', res.body);


    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  }, 15000);

  it('should login an existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'Test1234'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  }, 15000);
});
