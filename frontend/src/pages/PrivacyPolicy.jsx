import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../features/shared/components/Footer';

const PrivacyPolicy = ({ theme = 'dark' }) => {
  return (
    <div className="pipwise-page-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-primary, #0b0d12)', color: 'var(--text-primary, #ffffff)', paddingTop: '110px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 80px' }}>
        
        {/* Breadcrumb / Back button */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', marginBottom: '24px', transition: 'color 0.2s' }}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '40px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(252, 93, 33, 0.1)', border: '1px solid rgba(252, 93, 33, 0.25)', color: 'var(--brand-green, #fc5d21)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
            <Shield size={14} />
            <span>Compliance &amp; Data Security</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Privacy Policy &amp; Security Standards
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0, lineHeight: 1.6 }}>
            Last updated: September 2026. How TradeSafe Brokers &amp; PipWise safeguard trader identity, encrypted passwords, and OTP verification codes.
          </p>
        </motion.div>

        {/* Content Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'var(--bg-card, #131720)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Lock size={20} color="var(--brand-green, #fc5d21)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>1. Zero-Knowledge Cryptographic Authentication</h2>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.7, margin: 0 }}>
              All passwords on PipWise are hashed using industry-standard bcrypt salt hashing (10 salt rounds) before reaching database storage. We never store plain-text passwords or plain-text OTP verification codes. Your 4-digit email OTPs are hashed cryptographically and expire automatically after 10 minutes.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card, #131720)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Eye size={20} color="var(--brand-green, #fc5d21)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>2. Unbiased Reviews &amp; Zero Paid Rankings</h2>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.7, margin: 0 }}>
              PipWise operates with 100% editorial independence. Broker ratings, spread benchmarks, and comparison positions cannot be purchased or boosted through advertising payments. Every trader review requires verified OTP authentication to prevent bot spam and fake reviews.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card, #131720)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <CheckCircle2 size={20} color="var(--brand-green, #fc5d21)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>3. Information We Collect &amp; Cookie Usage</h2>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.7, margin: '0 0 12px' }}>
              We collect minimal personal data: strictly your email address and public username for account authentication and notification preferences. We use secure HTTP-only cookies (<code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>accessToken</code>) to keep your session active securely across page navigation.
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.7, margin: 0 }}>
              We never sell, rent, or trade your personal information with third-party advertisers or unregulated offshore broker entities.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card, #131720)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', borderRadius: '16px', padding: '28px 32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 14px' }}>4. Contact the Data Protection Officer</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.7, margin: 0 }}>
              If you have any questions regarding your data, privacy rights, or wish to request account deletion, reach out to our security team directly at{' '}
              <a href="mailto:admin@tradesafebrokers.com" style={{ color: 'var(--brand-green, #fc5d21)', textDecoration: 'none', fontWeight: 600 }}>
                admin@tradesafebrokers.com
              </a>.
            </p>
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
