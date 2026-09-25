import { Router } from 'express';
import {
  getBrokerReviews,
  createReview,
  replyToReview,
  voteHelpful,
  deleteReview,
} from '../controllers/review.controller.js';
import { verifyJWT, optionalVerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: Get reviews & aggregate stats (can filter by brokerId, brokerSlug, etc.)
router.route('/').get(getBrokerReviews);

// Submit new review (trader or broker partner)
router.route('/').post(optionalVerifyJWT, createReview);

// Broker Official Reply to a review
router.route('/:id/reply').post(optionalVerifyJWT, replyToReview);

// Vote a review as helpful
router.route('/:id/helpful').post(optionalVerifyJWT, voteHelpful);

// Delete review (admin or author)
router.route('/:id').delete(verifyJWT, deleteReview);

export default router;
