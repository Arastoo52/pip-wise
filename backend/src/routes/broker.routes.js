import { Router } from 'express';
import {
  getAllBrokers,
  createBroker,
  getBrokerBySlug,
  deleteBroker,
} from '../controllers/broker.controller.js';
import { createBrokerValidation } from '../validations/broker.validation.js';
import { validate } from '../middlewares/validate.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route to fetch all brokers
router.route('/').get(getAllBrokers);

// Protected route: Only authenticated users/partners can join/register a broker firm
router.route('/').post(verifyJWT, createBrokerValidation, validate, createBroker);

// Public route to get broker by slug
router.route('/:slug').get(getBrokerBySlug);

// Route to delete broker
router.route('/:id').delete(deleteBroker);

export default router;
