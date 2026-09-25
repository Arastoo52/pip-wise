import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Author role/title is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: String,
      default: '5.0',
    },
    review: {
      type: String,
      required: [true, 'Review/quote text is required'],
      trim: true,
    },
    row: {
      type: String,
      enum: ['top', 'bottom'],
      default: 'top',
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
