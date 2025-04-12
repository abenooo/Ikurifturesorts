const request = require('supertest');
const app = require('../../src/server');
const Booking = require('../../src/models/Booking');
const Service = require('../../src/models/Service');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

describe('Booking Routes', () => {
  let token;
  let serviceId;
  let userId;

  beforeEach(async () => {
    // Create user
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id;

    // Create service
    const service = await Service.create({
      name: 'Test Service',
      description: 'Test Description',
      category: 'Accommodation',
      price: 100,
      duration: 60,
      capacity: 2
    });
    serviceId = service._id;

    // Generate token
    token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  describe('POST /api/bookings', () => {
    it('should create new booking', async () => {
      const bookingData = {
        serviceId,
        date: new Date(Date.now() + 86400000), // Tomorrow
        numberOfGuests: 2,
        specialRequests: 'Test request',
        paymentMethod: 'Credit Card'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.user.toString()).toBe(userId.toString());
      expect(response.body.service.toString()).toBe(serviceId.toString());
      expect(response.body.numberOfGuests).toBe(bookingData.numberOfGuests);
    });

    it('should not create booking without token', async () => {
      const bookingData = {
        serviceId,
        date: new Date(Date.now() + 86400000),
        numberOfGuests: 2,
        specialRequests: 'Test request',
        paymentMethod: 'Credit Card'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/bookings/my-bookings', () => {
    beforeEach(async () => {
      await Booking.create({
        user: userId,
        service: serviceId,
        date: new Date(Date.now() + 86400000),
        numberOfGuests: 2,
        totalPrice: 200,
        paymentMethod: 'Credit Card'
      });
    });

    it('should get user bookings', async () => {
      const response = await request(app)
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].user.toString()).toBe(userId.toString());
    });

    it('should not get bookings without token', async () => {
      const response = await request(app)
        .get('/api/bookings/my-bookings');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/bookings/:id/cancel', () => {
    let bookingId;

    beforeEach(async () => {
      const booking = await Booking.create({
        user: userId,
        service: serviceId,
        date: new Date(Date.now() + 86400000),
        numberOfGuests: 2,
        totalPrice: 200,
        paymentMethod: 'Credit Card'
      });
      bookingId = booking._id;
    });

    it('should cancel booking', async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Booking cancelled successfully');
      expect(response.body.booking.status).toBe('Cancelled');
    });

    it('should not cancel booking without token', async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}/cancel`);

      expect(response.status).toBe(401);
    });
  });
}); 