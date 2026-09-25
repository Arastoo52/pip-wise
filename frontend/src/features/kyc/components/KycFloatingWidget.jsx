import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  X,
  ChevronUp,
} from 'lucide-react';
import useAuth from '../../auth/hooks/useAuth.js';
import KycModal from './KycModal.jsx';
import './KycFloatingWidget.css';

export const KycFloatingWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Only display to logged-in users who are normal traders (not admins)
  // and whose KYC is NOT yet verified!
  if (!isAuthenticated || !user) return null;
  if (user.role === 'admin') return null;
  if (user.isKycVerified || user.kycStatus === 'verified') return null;

  const kycStatus = user.kycStatus || 'not_submitted';

  return (
    <>
      <AnimatePresence>
        {isMinimized ? (
          <motion.button
            key="minimized-kyc-pill"
            className="kyc-minimized-pill"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            onClick={() => setIsMinimized(false)}
            title="Complete your Aadhaar KYC"
            type="button"
          >
            <span className="kyc-minimized-icon-box">
              <ShieldCheck size={14} strokeWidth={2.4} />
            </span>
            <span className="kyc-minimized-label">Complete KYC</span>
            <ChevronUp size={13} className="kyc-chevron-icon" />
          </motion.button>
        ) : (
          <motion.div
            key="full-kyc-widget"
            className="kyc-floating-widget"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient subtle glow background */}
            <div className="kyc-widget-glow" aria-hidden="true" />

            <div className="kyc-widget-top">
              <span
                className={`kyc-widget-badge ${
                  kycStatus === 'rejected'
                    ? 'rejected'
                    : kycStatus === 'pending'
                    ? 'pending'
                    : 'action'
                }`}
              >
                <span className="kyc-pulse-dot" />
                {kycStatus === 'rejected'
                  ? 'Correction Needed'
                  : kycStatus === 'pending'
                  ? 'Under Review'
                  : 'Action Required'}
              </span>

              <button
                className="kyc-widget-close"
                onClick={() => setIsMinimized(true)}
                title="Minimize notice"
                type="button"
                aria-label="Minimize"
              >
                <X size={13} />
              </button>
            </div>

            <div className="kyc-widget-header">
              <div className="kyc-widget-icon-wrap">
                {kycStatus === 'pending' ? (
                  <Clock size={16} strokeWidth={2.4} />
                ) : (
                  <ShieldCheck size={16} strokeWidth={2.4} />
                )}
              </div>
              <div className="kyc-widget-title-group">
                <h4 className="kyc-widget-title">
                  {kycStatus === 'rejected'
                    ? 'KYC Update Required'
                    : kycStatus === 'pending'
                    ? 'KYC Under Review'
                    : 'Complete Your KYC'}
                </h4>
                <p className="kyc-widget-desc">
                  {kycStatus === 'rejected'
                    ? 'Photo or document was rejected. Please re-upload clear photos.'
                    : kycStatus === 'pending'
                    ? 'Aadhaar documents submitted. Verification is in progress.'
                    : 'Verify your Aadhaar to earn the official Verified Trader badge.'}
                </p>
              </div>
            </div>

            <button
              className="kyc-widget-btn"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              <span>
                {kycStatus === 'rejected'
                  ? 'Re-upload Aadhaar'
                  : kycStatus === 'pending'
                  ? 'View Submission'
                  : 'Verify with Aadhaar'}
              </span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <KycModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onKycUpdated={(updatedUser) => {
          if (updatedUser?.isKycVerified) {
            setIsMinimized(true);
          }
        }}
      />
    </>
  );
};

export default KycFloatingWidget;
