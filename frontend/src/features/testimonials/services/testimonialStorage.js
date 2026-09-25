import apiClient from '../../auth/services/api.client.js';

export const INITIAL_DEMO_TESTIMONIALS = [
  {
    _id: 'demo-top-1',
    name: 'Mohd Siraj',
    role: 'Funded Scalper & Active Trader',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'PipWise made choosing a broker effortless. The raw spread comparison between IC Markets and Exness saved me over $400 a month in trading commissions. Indispensable tool!',
    row: 'top',
    isDemo: true,
  },
  {
    _id: 'demo-top-2',
    name: 'Dr. Mukti Prasad Dash',
    role: 'Portfolio Manager & Swing Trader',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'The regulatory license verification and overnight swap fee transparency on PipWise are incredible. It gives me complete confidence knowing my capital is with Tier-1 regulated brokers.',
    row: 'top',
    isDemo: true,
  },
  {
    _id: 'demo-top-3',
    name: 'Pradum Kumar',
    role: 'Day Trader (EUR/USD, XAU/USD)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: '4.8',
    review: 'I used to trade with an offshore broker suffering massive slippage. PipWise’s live execution speed benchmarks directed me to Pepperstone. Night and day difference!',
    row: 'top',
    isDemo: true,
  },
  {
    _id: 'demo-top-4',
    name: 'Ananya Deshmukh',
    role: 'Algorithmic & EA Strategy Trader',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'Ultra-low MT5 VPS execution latency was non-negotiable for my algorithmic bots. PipWise’s latency testing data was 100% accurate. Saved me months of costly trial and error.',
    row: 'top',
    isDemo: true,
  },
  {
    _id: 'demo-top-5',
    name: 'Vikramaditya Sen',
    role: 'Prop Desk Trading Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'Our trading desk cross-checks every broker with PipWise before allocating live funds. Timely withdrawal records, FCA/CySEC audit notes, and honest ratings make them our go-to.',
    row: 'top',
    isDemo: true,
  },
  {
    _id: 'demo-top-6',
    name: 'Sneha Roy',
    role: 'Retail Forex Trader',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'Clean side-by-side comparison, real trader reviews, and zero deceptive marketing. Finding a broker with $10 minimum deposit and instant local deposits was smooth and hassle-free.',
    row: 'top',
    isDemo: true,
  },
  {
    _id: 'demo-bot-1',
    name: 'Akash Warade',
    role: 'High-Frequency FX Trader',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'Whenever someone asks about broker withdrawal speeds, PipWise is the first portal I send them. They test the exact metrics brokers usually hide. Pure respect for their team!',
    row: 'bottom',
    isDemo: true,
  },
  {
    _id: 'demo-bot-2',
    name: 'Pragati Nayak',
    role: 'Price Action Mentor & Trader',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'I advise every beginner in my trading mentorship group to first compare broker spreads on PipWise. Genuine transparency and safety save you from catastrophic blow-ups.',
    row: 'bottom',
    isDemo: true,
  },
  {
    _id: 'demo-bot-3',
    name: 'Samarth Jain',
    role: 'Forex Community Lead',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    rating: '4.8',
    review: '100% transparent and reliable. Comparing spread costs during high-impact news like CPI and NFP gave me realistic expectations. Knowing your broker is safe brings true peace of mind.',
    row: 'bottom',
    isDemo: true,
  },
  {
    _id: 'demo-bot-4',
    name: 'Ritu & Sanjay Joshi',
    role: 'Private Wealth & Multi-Asset Investors',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'We evaluate multi-asset brokers with PipWise. The side-by-side view showing leverage limits, Tier-1 regulation (FCA, ASIC), and client fund segregation is brilliantly implemented.',
    row: 'bottom',
    isDemo: true,
  },
  {
    _id: 'demo-bot-5',
    name: 'Karan Malhotra',
    role: 'Macro & News Trader',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'During emergency volatility spikes, execution speed and slippage protection are everything. PipWise’s detailed broker breakdowns give you the honest, unedited truth.',
    row: 'bottom',
    isDemo: true,
  },
  {
    _id: 'demo-bot-6',
    name: 'Meera Iyer',
    role: 'Automated Strategy Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'A genuinely honest review platform doing groundbreaking work. Their comprehensive broker fee calculator and raw spread analyses are unmatched anywhere in the industry.',
    row: 'bottom',
    isDemo: true,
  }
];

const DELETED_KEY = 'pipwise_deleted_testimonial_ids';
const CACHED_KEY = 'pipwise_testimonials_cache';

export const getDeletedIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addDeletedId = (id) => {
  try {
    const current = getDeletedIds();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to store deleted id', e);
  }
  // Dispatch notification for live listener across tabs and components
  try {
    window.dispatchEvent(new CustomEvent('pipwise_testimonials_updated', { detail: { deletedId: id } }));
  } catch (e) {}
};

export const clearDeletedIds = () => {
  try {
    localStorage.removeItem(DELETED_KEY);
    localStorage.removeItem(CACHED_KEY);
  } catch (e) {}
  try {
    window.dispatchEvent(new CustomEvent('pipwise_testimonials_updated', { detail: { reset: true } }));
  } catch (e) {}
};

/**
 * Synchronous retrieval of active testimonials (0ms latency, zero re-render flicker)
 */
export const getSynchronousTestimonials = () => {
  const deletedIds = getDeletedIds();
  try {
    const cached = localStorage.getItem(CACHED_KEY);
    if (cached) {
      const list = JSON.parse(cached);
      if (Array.isArray(list) && list.length > 0) {
        return list.filter((t) => !deletedIds.includes(t._id) && !deletedIds.includes(t.name));
      }
    }
  } catch (e) {}

  return INITIAL_DEMO_TESTIMONIALS.filter(
    (t) => !deletedIds.includes(t._id) && !deletedIds.includes(t.name)
  );
};

/**
 * Fetch testimonials with backend API + local fallback & sync
 */
export const fetchActiveTestimonials = async () => {
  const deletedIds = getDeletedIds();
  try {
    const res = await apiClient.get('/testimonials', { timeout: 3000 });
    if (res.data?.testimonials && Array.isArray(res.data.testimonials)) {
      const live = res.data.testimonials.filter(
        (t) => !deletedIds.includes(t._id) && !deletedIds.includes(t.name)
      );
      try {
        localStorage.setItem(CACHED_KEY, JSON.stringify(res.data.testimonials));
      } catch (e) {}
      return live;
    }
  } catch (err) {
    // Graceful offline fallback
  }

  return getSynchronousTestimonials();
};
