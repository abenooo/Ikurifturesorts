const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getAvailableServices
} = require('../controllers/serviceController');

// Public routes
router.get('/', getAllServices);
router.get('/category/:category', getServicesByCategory);
router.get('/available', getAvailableServices);
router.get('/:id', getServiceById);

// Protected routes (admin only)
router.post('/', auth, createService);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);

module.exports = router; 