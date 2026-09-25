import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
      required: false,
      index: true,
    },
    brokerName: {
      type: String,
      required: [true, 'Broker name is required'],
      trim: true,
      index: true,
    },
    brokerSlug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    username: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      default: 'Verified Trader',
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5,
    },
    title: {
      type: String,
      trim: true,
      default: 'Excellent Trading Experience',
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'positive',
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
      index: true,
    },
    verifiedTrader: {
      type: Boolean,
      default: true,
    },
    depositMethodUsed: {
      type: String,
      default: 'UPI / IMPS',
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model('Review', reviewSchema);
