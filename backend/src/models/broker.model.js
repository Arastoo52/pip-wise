import mongoose from 'mongoose';

const brokerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Broker name is required'],
      trim: true,
      index: true,
      maxlength: [80, 'Broker name cannot exceed 80 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    highlightBadge: {
      type: String,
      default: 'Verified Broker Partner',
      trim: true,
    },
    badgeTheme: {
      type: String,
      default: 'emerald',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1.0, 'Rating must be at least 1.0'],
      max: [5.0, 'Rating cannot exceed 5.0'],
    },
    reviewsCount: {
      type: String,
      default: '120+ verified reviews',
    },
    trustScore: {
      type: Number,
      default: 95,
      min: [1, 'Trust score must be at least 1'],
      max: [100, 'Trust score cannot exceed 100'],
    },
    rankNum: {
      type: Number,
      default: 99,
      index: true,
    },
    rank: {
      type: String,
      default: '#99',
    },
    isFirst: {
      type: Boolean,
      default: false,
    },
    minDeposit: {
      type: String,
      default: '₹850 ($10)',
    },
    minDepositINR: {
      type: Number,
      default: 850,
      index: true,
    },
    minDepositUSD: {
      type: Number,
      default: 10,
    },
    spread: {
      type: String,
      default: 'From 0.1 pips',
    },
    spreadNum: {
      type: Number,
      default: 0.1,
      index: true,
    },
    maxLeverage: {
      type: String,
      default: '1:1000',
    },
    regulation: {
      type: String,
      default: 'FCA, CySEC, FSA',
    },
    regulatorsList: {
      type: [String],
      default: ['FCA', 'CySEC'],
    },
    platforms: {
      type: String,
      default: 'MT4, MT5, Web App',
    },
    platformsList: {
      type: [String],
      default: ['MT4', 'MT5'],
    },
    payments: {
      type: String,
      default: 'UPI, IMPS, NetBanking, Cards, Crypto',
    },
    paymentsList: {
      type: [String],
      default: ['UPI', 'NetBanking', 'Crypto'],
    },
    executionType: {
      type: String,
      default: 'STP / ECN Direct',
    },
    accountTypes: {
      type: String,
      default: 'Standard, Raw Spread, Pro',
    },
    features: {
      type: [String],
      default: ['Instant Local Payouts', 'Zero Commission Option', 'Tier-1 Regulated', '24/7 Dedicated Support'],
    },
    pros: {
      type: [String],
      default: ['Ultra-fast deposit & withdrawal confirmation', 'Low spreads on major currency pairs'],
    },
    cons: {
      type: [String],
      default: ['Standard terms apply on bonus campaigns'],
    },
    yearFounded: {
      type: Number,
      default: 2020,
    },
    headquarters: {
      type: String,
      default: 'Limassol, Cyprus',
    },
    categories: {
      type: [String],
      default: ['top-rated', 'upi-accepted', 'raw-spread'],
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: '',
    },
    affiliateUrl: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid contact email address'],
    },
    representativeName: {
      type: String,
      trim: true,
      default: '',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    brandColor: {
      type: String,
      default: '#2EE8C2',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isVerifiedPartner: {
      type: Boolean,
      default: false,
    },
    verificationBadge: {
      type: String,
      default: 'Verified Broker',
    },
    licenseNumber: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    isSeeded: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Format helper before saving
brokerSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (this.rankNum && !this.rank) {
    this.rank = `#${this.rankNum}`;
  }
});

export const Broker = mongoose.model('Broker', brokerSchema);
