const request = require('supertest');
const app = require('../../src/server');
const Service = require('../../src/models/Service');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

describe('Service Routes', () => {
  let token;

  beforeEach(async () => {
    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true
    });

    // Generate token
    token = jwt.sign(
      { userId: adminUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  describe('GET /api/services', () => {
    beforeEach(async () => {
      await Service.create({
        name: 'Test Service',
        description: 'Test Description',
        category: 'Accommodation',
        price: 100,
        duration: 60,
        capacity: 2
      });
    });

    it('should get all services', async () => {
      const response = await request(app)
        .get('/api/services');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Test Service');
    });
  });

  describe('POST /api/services', () => {
    it('should create new service with valid token', async () => {
      const serviceData = {
        name: 'New Service',
        description: 'New Description',
        category: 'Spa',
        price: 200,
        duration: 90,
        capacity: 1
      };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send(serviceData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(serviceData.name);
      expect(response.body.category).toBe(serviceData.category);
    });

    it('should not create service without token', async () => {
      const serviceData = {
        name: 'New Service',
        description: 'New Description',
        category: 'Spa',
        price: 200,
        duration: 90,
        capacity: 1
      };

      const response = await request(app)
        .post('/api/services')
        .send(serviceData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/services/category/:category', () => {
    beforeEach(async () => {
      await Service.create([
        {
          name: 'Spa Service 1',
          description: 'Spa Description 1',
          category: 'Spa',
          price: 100,
          duration: 60,
          capacity: 2
        },
        {
          name: 'Spa Service 2',
          description: 'Spa Description 2',
          category: 'Spa',
          price: 150,
          duration: 90,
          capacity: 1
        },
        {
          name: 'Dining Service',
          description: 'Dining Description',
          category: 'Dining',
          price: 50,
          duration: 120,
          capacity: 4
        }
      ]);
    });

    it('should get services by category', async () => {
      const response = await request(app)
        .get('/api/services/category/Spa');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].category).toBe('Spa');
    });
  });
}); 