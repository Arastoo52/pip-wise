import { Router } from 'express';
import {
  getAllBrokers,
  createBroker,
  getBrokerBySlug,
  deleteBroker,
  recordBrokerClick,
  updatePromotionalOffer,
  submitTraderInquiry,
  replyTraderInquiry,
} from '../controllers/broker.controller.js';
import { createBrokerValidation } from '../validations/broker.validation.js';
import { validate } from '../middlewares/validate.middleware.js';
import { verifyJWT, optionalVerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route to fetch all brokers
router.route('/').get(getAllBrokers);

// Protected route: Only authenticated users/partners can join/register a broker firm
router.route('/').post(verifyJWT, createBrokerValidation, validate, createBroker);

// Record click lead on broker
router.route('/:id/click').post(recordBrokerClick);

// Broker promotional deposit bonus / promo code update
router.route('/:id/promotion').patch(optionalVerifyJWT, updatePromotionalOffer);

// Trader direct inquiry to broker
router.route('/:id/inquiry').post(optionalVerifyJWT, submitTraderInquiry);

// Broker reply to trader inquiry
router.route('/:id/inquiry/:inquiryId/reply').post(optionalVerifyJWT, replyTraderInquiry);

// Public route to get broker by slug
router.route('/:slug').get(getBrokerBySlug);

// Route to delete broker
router.route('/:id').delete(deleteBroker);

export default router;
