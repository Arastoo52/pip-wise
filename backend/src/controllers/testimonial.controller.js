import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Testimonial } from '../models/testimonial.model.js';

export const DEFAULT_DEMO_TESTIMONIALS = [
  {
    name: 'Mohd Siraj',
    role: 'Funded Scalper & Active Trader',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'PipWise made choosing a broker effortless. The raw spread comparison between IC Markets and Exness saved me over $400 a month in trading commissions. Indispensable tool!',
    row: 'top',
    isDemo: true,
  },
  {
    name: 'Dr. Mukti Prasad Dash',
    role: 'Portfolio Manager & Swing Trader',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'The regulatory license verification and overnight swap fee transparency on PipWise are incredible. It gives me complete confidence knowing my capital is with Tier-1 regulated brokers.',
    row: 'top',
    isDemo: true,
  },
  {
    name: 'Pradum Kumar',
    role: 'Day Trader (EUR/USD, XAU/USD)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: '4.8',
    review: 'I used to trade with an offshore broker suffering massive slippage. PipWise’s live execution speed benchmarks directed me to Pepperstone. Night and day difference!',
    row: 'top',
    isDemo: true,
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Algorithmic & EA Strategy Trader',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'Ultra-low MT5 VPS execution latency was non-negotiable for my algorithmic bots. PipWise’s latency testing data was 100% accurate. Saved me months of costly trial and error.',
    row: 'top',
    isDemo: true,
  },
  {
    name: 'Vikramaditya Sen',
    role: 'Prop Desk Trading Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'Our trading desk cross-checks every broker with PipWise before allocating live funds. Timely withdrawal records, FCA/CySEC audit notes, and honest ratings make them our go-to.',
    row: 'top',
    isDemo: true,
  },
  {
    name: 'Sneha Roy',
    role: 'Retail Forex Trader',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'Clean side-by-side comparison, real trader reviews, and zero deceptive marketing. Finding a broker with $10 minimum deposit and instant local deposits was smooth and hassle-free.',
    row: 'top',
    isDemo: true,
  },
  {
    name: 'Akash Warade',
    role: 'High-Frequency FX Trader',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'Whenever someone asks about broker withdrawal speeds, PipWise is the first portal I send them. They test the exact metrics brokers usually hide. Pure respect for their team!',
    row: 'bottom',
    isDemo: true,
  },
  {
    name: 'Pragati Nayak',
    role: 'Price Action Mentor & Trader',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'I advise every beginner in my trading mentorship group to first compare broker spreads on PipWise. Genuine transparency and safety save you from catastrophic blow-ups.',
    row: 'bottom',
    isDemo: true,
  },
  {
    name: 'Samarth Jain',
    role: 'Forex Community Lead',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    rating: '4.8',
    review: '100% transparent and reliable. Comparing spread costs during high-impact news like CPI and NFP gave me realistic expectations. Knowing your broker is safe brings true peace of mind.',
    row: 'bottom',
    isDemo: true,
  },
  {
    name: 'Ritu & Sanjay Joshi',
    role: 'Private Wealth & Multi-Asset Investors',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'We evaluate multi-asset brokers with PipWise. The side-by-side view showing leverage limits, Tier-1 regulation (FCA, ASIC), and client fund segregation is brilliantly implemented.',
    row: 'bottom',
    isDemo: true,
  },
  {
    name: 'Karan Malhotra',
    role: 'Macro & News Trader',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'During emergency volatility spikes, execution speed and slippage protection are everything. PipWise’s detailed broker breakdowns give you the honest, unedited truth.',
    row: 'bottom',
    isDemo: true,
  },
  {
    name: 'Meera Iyer',
    role: 'Automated Strategy Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'A genuinely honest review platform doing groundbreaking work. Their comprehensive broker fee calculator and raw spread analyses are unmatched anywhere in the industry.',
    row: 'bottom',
    isDemo: true,
  }
];

// Helper to auto-seed if empty
const ensureTestimonialsSeeded = async () => {
  const count = await Testimonial.countDocuments();
  if (count === 0) {
    await Testimonial.insertMany(DEFAULT_DEMO_TESTIMONIALS);
  }
};

/**
 * @desc    Get all public testimonials for the homepage animation
 * @route   GET /api/v1/testimonials
 * @access  Public
 */
export const getPublicTestimonials = asyncHandler(async (req, res) => {
  await ensureTestimonialsSeeded();
  const testimonials = await Testimonial.find().sort({ createdAt: 1 });

  return res.status(200).json(
    new ApiResponse(200, { testimonials, count: testimonials.length }, 'Testimonials fetched successfully')
  );
});

/**
 * @desc    Get all testimonials for Admin Dashboard management
 * @route   GET /api/v1/admin/testimonials
 * @access  Private (Admin only)
 */
export const getAllAdminTestimonials = asyncHandler(async (req, res) => {
  await ensureTestimonialsSeeded();
  const { search, row } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
      { review: { $regex: search, $options: 'i' } },
    ];
  }
  if (row && ['top', 'bottom'].includes(row)) {
    query.row = row;
  }

  const testimonials = await Testimonial.find(query).sort({ createdAt: 1 });

  return res.status(200).json(
    new ApiResponse(200, { testimonials, count: testimonials.length }, 'Admin testimonials fetched successfully')
  );
});

/**
 * @desc    Delete a testimonial permanently
 * @route   DELETE /api/v1/admin/testimonials/:id
 * @access  Private (Admin only)
 */
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  return res.status(200).json(
    new ApiResponse(200, { testimonial }, `Testimonial by "${testimonial.name}" deleted successfully`)
  );
});

/**
 * @desc    Reset testimonials back to default demo set
 * @route   POST /api/v1/admin/testimonials/reset
 * @access  Private (Admin only)
 */
export const resetDemoTestimonials = asyncHandler(async (req, res) => {
  await Testimonial.deleteMany({});
  const seeded = await Testimonial.insertMany(DEFAULT_DEMO_TESTIMONIALS);

  return res.status(200).json(
    new ApiResponse(200, { testimonials: seeded, count: seeded.length }, 'Demo testimonials restored successfully')
  );
});

/**
 * @desc    Add a new testimonial
 * @route   POST /api/v1/admin/testimonials
 * @access  Private (Admin only)
 */
export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, avatar, rating, review, row } = req.body;

  if (!name || !role || !review) {
    throw new ApiError(400, 'Name, role, and review are required');
  }

  const testimonial = await Testimonial.create({
    name,
    role,
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: rating || '5.0',
    review,
    row: row === 'bottom' ? 'bottom' : 'top',
    isDemo: false,
  });

  return res.status(201).json(
    new ApiResponse(201, { testimonial }, 'Testimonial created successfully')
  );
});
