import { body } from 'express-validator';

export const createBrokerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Broker name is required')
    .isLength({ min: 2, max: 80 })
    .withMessage('Broker name must be between 2 and 80 characters'),

  body('contactEmail')
    .trim()
    .notEmpty()
    .withMessage('Official contact email is required')
    .isEmail()
    .withMessage('Please provide a valid official email address')
    .normalizeEmail(),

  body('minDepositINR')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Minimum deposit must be a valid number'),

  body('spreadNum')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Spread must be a valid number'),

  body('websiteUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL (e.g. https://...)'),
];
