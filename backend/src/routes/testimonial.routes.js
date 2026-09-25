import { Router } from 'express';
import { getPublicTestimonials } from '../controllers/testimonial.controller.js';

const router = Router();

// Public route for homepage marquee
router.get('/', getPublicTestimonials);

export default router;
