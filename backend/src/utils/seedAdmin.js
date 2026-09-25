import { User } from '../models/user.model.js';
import { Review } from '../models/review.model.js';
import { Broker } from '../models/broker.model.js';

export const seedAdminAndReviews = async () => {
  try {
    // 1. Seed or ensure Admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const defaultAdmin = await User.create({
        username: 'admin',
        email: 'admin@pipwise.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      });
      console.log(`👑 Default Admin Account Initialized: ${defaultAdmin.email} (Password: admin123)`);
    }

    // 2. Seed initial reviews if empty
    const reviewsCount = await Review.countDocuments();
    if (reviewsCount === 0) {
      const sampleBrokers = await Broker.find({}).limit(5);
      const exness = sampleBrokers.find((b) => b.slug === 'exness') || sampleBrokers[0];
      const xm = sampleBrokers.find((b) => b.slug === 'xm') || sampleBrokers[1] || sampleBrokers[0];
      const icMarkets = sampleBrokers.find((b) => b.slug === 'ic-markets') || sampleBrokers[2] || sampleBrokers[0];

      const initialReviews = [
        {
          broker: exness?._id,
          brokerName: exness?.name || 'Exness',
          brokerSlug: exness?.slug || 'exness',
          username: 'Rohit Sharma',
          userEmail: 'rohit.trader@gmail.com',
          rating: 5,
          title: 'Instant UPI payout in under 2 minutes!',
          comment: 'Best broker for Indian forex traders. Deposited ₹15,000 via PhonePe and withdrew ₹28,400 profit within 90 seconds without any hassle.',
          sentiment: 'positive',
          status: 'approved',
          verifiedTrader: true,
          depositMethodUsed: 'UPI (PhonePe)',
        },
        {
          broker: exness?._id,
          brokerName: exness?.name || 'Exness',
          brokerSlug: exness?.slug || 'exness',
          username: 'Aarav Patel',
          userEmail: 'aarav.forex@outlook.com',
          rating: 5,
          title: 'Raw spread on EURUSD is unmatched',
          comment: 'Zero swap fees during high volatility news releases. Spreads remained at 0.1 pips throughout FOMC statements.',
          sentiment: 'positive',
          status: 'approved',
          verifiedTrader: true,
          depositMethodUsed: 'NetBanking / IMPS',
        },
        {
          broker: xm?._id,
          brokerName: xm?.name || 'XM',
          brokerSlug: xm?.slug || 'xm',
          username: 'Pooja Verma',
          userEmail: 'pooja.v@tradinghub.in',
          rating: 4,
          title: 'Great MT5 execution and Hindi support',
          comment: 'Customer support in Hindi was very helpful in resolving my KYC verification. Leverage is flexible and execution speed is very fast.',
          sentiment: 'positive',
          status: 'approved',
          verifiedTrader: true,
          depositMethodUsed: 'UPI (Google Pay)',
        },
        {
          broker: icMarkets?._id,
          brokerName: icMarkets?.name || 'IC Markets',
          brokerSlug: icMarkets?.slug || 'ic-markets',
          username: 'Devansh Kulkarni',
          userEmail: 'devansh.k@gmail.com',
          rating: 4,
          title: 'True ECN liquidity for cTrader users',
          comment: 'Commission is very reasonable at $3.5 per lot per side. Never faced slippage even during NFP data drops.',
          sentiment: 'positive',
          status: 'approved',
          verifiedTrader: true,
          depositMethodUsed: 'Crypto (USDT)',
        },
        {
          broker: xm?._id,
          brokerName: xm?.name || 'XM',
          brokerSlug: xm?.slug || 'xm',
          username: 'Vikram Singh',
          userEmail: 'vikram.singh99@yahoo.com',
          rating: 3,
          title: 'Standard spread could be tighter on GBP pairs',
          comment: 'Withdrawals are reliable but standard account spreads on GBPJPY widen to 2.2 pips during Asian session. Recommend Ultra Low account instead.',
          sentiment: 'neutral',
          status: 'pending',
          verifiedTrader: true,
          depositMethodUsed: 'Debit Card',
        },
        {
          broker: exness?._id,
          brokerName: exness?.name || 'Exness',
          brokerSlug: exness?.slug || 'exness',
          username: 'Karan Mehra',
          userEmail: 'karan.m@rediffmail.com',
          rating: 5,
          title: 'Seamless weekend crypto deposits',
          comment: 'Able to fund account on Sunday night before market open. Verification took less than 15 minutes with Aadhaar card.',
          sentiment: 'positive',
          status: 'approved',
          verifiedTrader: true,
          depositMethodUsed: 'UPI / Paytm',
        },
      ];

      await Review.insertMany(initialReviews);
      console.log(`⭐ Seeded ${initialReviews.length} initial verified trader reviews.`);
    }
  } catch (error) {
    console.warn('Notice during admin/reviews seed:', error.message);
  }
};
