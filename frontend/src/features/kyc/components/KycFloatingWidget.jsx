import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  X,
  FileCheck2,
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
          <motion.div
            key="minimized-kyc-pill"
            className="kyc-minimized-pill"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => setIsMinimized(false)}
            title="Click to expand KYC verification"
          >
            <ShieldAlert size={16} />
            <span>Complete KYC</span>
            <ChevronUp size={14} />
          </motion.div>
        ) : (
          <motion.div
            key="full-kyc-widget"
            className="kyc-floating-widget"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
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
                  ? 'Action Required'
                  : kycStatus === 'pending'
                  ? 'Under Review'
                  : 'Action Required'}
              </span>

              <button
                className="kyc-widget-close"
                onClick={() => setIsMinimized(true)}
                title="Minimize widget"
              >
                <X size={15} />
              </button>
            </div>

            <div className="kyc-widget-title">
              <ShieldAlert size={18} color="#2ee8c2" />
              <span>
                {kycStatus === 'rejected'
                  ? 'KYC Verification Rejected'
                  : kycStatus === 'pending'
                  ? 'KYC Verification In Progress'
                  : 'Complete Your KYC'}
              </span>
            </div>

            <p className="kyc-widget-desc">
              {kycStatus === 'rejected'
                ? `Verification was rejected: ${user.kycData?.rejectionReason || 'Please re-upload a clear Aadhaar card.'}`
                : kycStatus === 'pending'
                ? 'Your Aadhaar document submission is currently being inspected by the compliance team.'
                : 'Upload your Aadhaar Card to get your official Verified Trader badge and full account access.'}
            </p>

            <button
              className="kyc-widget-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <span>
                {kycStatus === 'rejected'
                  ? 'Re-submit Aadhaar Card'
                  : kycStatus === 'pending'
                  ? 'View Submitted Details'
                  : 'Complete KYC with Aadhaar'}
              </span>
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <KycModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onKycUpdated={(updatedUser) => {
          // If verified or submitted, update state
          if (updatedUser?.isKycVerified) {
            setIsMinimized(true);
          }
        }}
      />
    </>
  );
};

export default KycFloatingWidget;
