import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Broker } from '../models/broker.model.js';
import { INITIAL_BROKERS } from '../constants/initialBrokers.js';

/**
 * Helper to slugify a string safely
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * @desc    Get all brokers with filtering and auto-seeding
 * @route   GET /api/v1/brokers
 * @access  Public
 */
export const getAllBrokers = asyncHandler(async (req, res) => {
  // If collection is missing any initial seed brokers, seed them
  const existingSlugs = new Set((await Broker.find({}, 'slug')).map((b) => b.slug));
  const missingBrokers = INITIAL_BROKERS.filter((b) => !existingSlugs.has(b.slug));
  if (missingBrokers.length > 0) {
    try {
      await Broker.insertMany(missingBrokers);
    } catch (seedErr) {
      console.warn('Initial broker seeding notice:', seedErr.message);
    }
  }

  const { search, category, regulator, sort } = req.query;
  const filter = { status: { $in: ['active', 'approved'] } };

  if (search && search.trim()) {
    const q = search.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { regulation: { $regex: q, $options: 'i' } },
      { platforms: { $regex: q, $options: 'i' } },
      { payments: { $regex: q, $options: 'i' } },
      { highlightBadge: { $regex: q, $options: 'i' } },
    ];
  }

  if (category && category !== 'all') {
    filter.categories = category;
  }

  if (regulator && regulator !== 'all') {
    filter.regulatorsList = { $in: [new RegExp(`^${regulator}$`, 'i')] };
  }

  let sortOption = { rankNum: 1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'spread') sortOption = { spreadNum: 1 };
  if (sort === 'deposit') sortOption = { minDepositINR: 1 };

  const brokers = await Broker.find(filter).sort(sortOption);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count: brokers.length,
        brokers,
      },
      'Brokers retrieved successfully'
    )
  );
});

/**
 * @desc    Create / Join as a new Broker
 * @route   POST /api/v1/brokers
 * @access  Public
 */
export const createBroker = asyncHandler(async (req, res) => {
  const {
    name,
    contactEmail,
    representativeName,
    websiteUrl,
    affiliateUrl,
    minDepositINR,
    minDepositUSD,
    spreadNum,
    maxLeverage,
    regulation,
    regulatorsList,
    platforms,
    platformsList,
    payments,
    paymentsList,
    executionType,
    accountTypes,
    features,
    pros,
    cons,
    yearFounded,
    headquarters,
    categories,
    highlightBadge,
    badgeTheme,
    brandColor,
    logoUrl,
    description,
  } = req.body;

  if (!name || !contactEmail) {
    throw new ApiError(400, 'Broker name and official contact email are required');
  }

  // Base slug
  let baseSlug = generateSlug(name) || 'broker';
  let slug = baseSlug;
  let counter = 1;

  while (await Broker.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Determine rank number
  const brokerCount = await Broker.countDocuments();
  const rankNum = brokerCount + 1;
  const rank = `#${rankNum}`;

  // Normalize numbers
  const depositINR = minDepositINR ? Number(minDepositINR) : 1000;
  const depositUSD = minDepositUSD ? Number(minDepositUSD) : Math.round(depositINR / 85) || 12;
  const spreadValue = spreadNum !== undefined && spreadNum !== '' ? Number(spreadNum) : 0.2;

  // Normalize arrays if strings passed
  const parseList = (val) => {
    if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const finalRegulators = parseList(regulatorsList).length > 0 ? parseList(regulatorsList) : ['FCA', 'CySEC'];
  const finalPlatforms = parseList(platformsList).length > 0 ? parseList(platformsList) : ['MT4', 'MT5'];
  const finalPayments = parseList(paymentsList).length > 0 ? parseList(paymentsList) : ['UPI', 'NetBanking', 'Crypto'];
  const finalFeatures = parseList(features).length > 0 ? parseList(features) : [
    'Instant Local Payouts (UPI/IMPS)',
    'Ultra-tight spreads from 0.0 pips',
    'Tier-1 Global Regulatory Compliance',
    '24/7 Dedicated Client Support'
  ];
  const finalPros = parseList(pros).length > 0 ? parseList(pros) : [
    'Fast deposit and automated withdrawal processing',
    'High leverage and deep ECN liquidity'
  ];
  const finalCons = parseList(cons).length > 0 ? parseList(cons) : [
    'Terms & Conditions apply to promotion credit'
  ];
  const finalCategories = parseList(categories).length > 0 ? parseList(categories) : [
    'top-rated',
    'upi-accepted',
    'raw-spread',
    'high-leverage'
  ];

  const newBroker = await Broker.create({
    name: name.trim(),
    slug,
    rankNum,
    rank,
    isFirst: false,
    highlightBadge: highlightBadge?.trim() || 'Verified Broker Partner',
    badgeTheme: badgeTheme || 'emerald',
    rating: 4.8,
    reviewsCount: 'New Verified Partner',
    trustScore: 96,
    minDeposit: `₹${depositINR.toLocaleString('en-IN')} ($${depositUSD})`,
    minDepositINR: depositINR,
    minDepositUSD: depositUSD,
    spread: `From ${spreadValue} pips`,
    spreadNum: spreadValue,
    maxLeverage: maxLeverage?.trim() || '1:1000',
    regulation: regulation?.trim() || finalRegulators.join(', '),
    regulatorsList: finalRegulators,
    platforms: platforms?.trim() || finalPlatforms.join(', '),
    platformsList: finalPlatforms,
    payments: payments?.trim() || finalPayments.join(', '),
    paymentsList: finalPayments,
    executionType: executionType?.trim() || 'STP / ECN Direct Liquidity',
    accountTypes: accountTypes?.trim() || 'Standard, Raw Spread, Pro',
    features: finalFeatures,
    pros: finalPros,
    cons: finalCons,
    yearFounded: yearFounded ? Number(yearFounded) : new Date().getFullYear(),
    headquarters: headquarters?.trim() || 'Financial District, Global',
    categories: finalCategories,
    websiteUrl: websiteUrl?.trim() || '',
    affiliateUrl: affiliateUrl?.trim() || websiteUrl?.trim() || '',
    contactEmail: contactEmail.toLowerCase().trim(),
    representativeName: representativeName?.trim() || req.user?.name || req.user?.username || '',
    logoUrl: logoUrl?.trim() || '',
    brandColor: brandColor || '#0284c7',
    description: description?.trim() || '',
    status: req.user?.role === 'admin' ? 'approved' : 'pending',
    isVerified: req.user?.role === 'admin',
    isSeeded: false,
    createdBy: req.user?._id || null,
  });

  const responseMsg =
    req.user?.role === 'admin'
      ? `Broker "${newBroker.name}" successfully created and approved live on PipWise!`
      : `Broker application for "${newBroker.name}" submitted successfully! It is now pending administrator review.`;

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        broker: newBroker,
      },
      responseMsg
    )
  );
});

/**
 * @desc    Get single broker by slug or ID
 * @route   GET /api/v1/brokers/:slug
 * @access  Public
 */
export const getBrokerBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const broker = await Broker.findOne({
    $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
  });

  if (!broker) {
    throw new ApiError(404, 'Broker not found');
  }

  return res.status(200).json(
    new ApiResponse(200, { broker }, 'Broker retrieved successfully')
  );
});

/**
 * @desc    Delete broker
 * @route   DELETE /api/v1/brokers/:id
 * @access  Public
 */
export const deleteBroker = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const broker = await Broker.findByIdAndDelete(id);

  if (!broker) {
    throw new ApiError(404, 'Broker not found');
  }

  return res.status(200).json(
    new ApiResponse(200, null, 'Broker removed successfully')
  );
});
