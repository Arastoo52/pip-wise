import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  X,
  Eye,
  MousePointerClick,
  ShieldCheck,
  Star,
  Sparkles,
  Tag,
  MessageCircleQuestion,
  Send,
  CornerDownRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Award,
} from 'lucide-react';
import { brokerService } from '../services/broker.service.js';
import useAuth from '../../auth/hooks/useAuth.js';
import { useToast } from '../../shared/components/toast/ToastContext.jsx';
import './BrokerHubModal.css';

export const BrokerHubModal = ({ isOpen, onClose, broker, onBrokerUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'promotion' | 'inquiries'

  // Promotion Form State
  const [promoHeadline, setPromoHeadline] = useState(
    broker?.promotionalOffer?.headline || 'Zero Swap Fees & Instant UPI Deposit Bonus'
  );
  const [promoCode, setPromoCode] = useState(broker?.promotionalOffer?.code || 'PIPTRADE100');
  const [promoExpiry, setPromoExpiry] = useState(
    broker?.promotionalOffer?.expiresAt || 'Active this month'
  );
  const [savingPromo, setSavingPromo] = useState(false);

  // Inquiries Form State
  const [inquiries, setInquiries] = useState(broker?.inquiries || []);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [askerName, setAskerName] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Reply to inquiry state: inquiryId -> { text: '', isOpen: bool, isSubmitting: bool }
  const [replyInputs, setReplyInputs] = useState({});

  if (!isOpen || !broker) return null;

  // Handle saving promotional offer
  const handleSavePromo = async (e) => {
    e.preventDefault();
    if (!promoHeadline.trim()) {
      toast.error('Headline Required', 'Please enter a promotion headline.');
      return;
    }

    setSavingPromo(true);
    try {
      const res = await brokerService.updatePromotion(broker._id, {
        headline: promoHeadline.trim(),
        code: promoCode.trim().toUpperCase(),
        expiresAt: promoExpiry.trim(),
        active: true,
      });

      toast.success('Promotion Published!', 'Your bonus offer is now visible to live traders.');
      if (onBrokerUpdated) {
        onBrokerUpdated({
          ...broker,
          promotionalOffer: res.data?.promotionalOffer,
        });
      }
    } catch (err) {
      toast.error('Update Failed', err.message || 'Could not update promotional offer.');
    } finally {
      setSavingPromo(false);
    }
  };

  // Handle submitting new trader inquiry
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || questionText.trim().length < 8) {
      toast.error('Question Too Short', 'Please enter a specific question (at least 8 characters).');
      return;
    }

    setSubmittingInquiry(true);
    try {
      const res = await brokerService.submitInquiry(broker._id, {
        question: questionText.trim(),
        traderName: isAuthenticated ? user.username : askerName.trim() || 'Verified Trader',
        traderEmail: isAuthenticated ? user.email : '',
      });

      toast.success('Question Submitted!', 'The broker official desk will answer shortly.');
      setInquiries(res.data?.inquiries || []);
      setQuestionText('');
      setIsAskingQuestion(false);
    } catch (err) {
      toast.error('Submission Failed', err.message || 'Could not submit inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Handle broker reply to inquiry
  const handleReplyInquiry = async (inquiryId) => {
    const input = replyInputs[inquiryId];
    if (!input?.text?.trim() || input.text.trim().length < 4) {
      toast.error('Answer Required', 'Please provide a clear answer.');
      return;
    }

    setReplyInputs((prev) => ({
      ...prev,
      [inquiryId]: { ...prev[inquiryId], isSubmitting: true },
    }));

    try {
      const res = await brokerService.replyInquiry(broker._id, inquiryId, {
        answer: input.text.trim(),
        answeredBy: user?.username ? `${user.username} (${broker.name} Desk)` : `${broker.name} Official Desk`,
      });

      toast.success('Answer Published!', 'Your official answer is now live for all traders to see.');
      setInquiries(res.data?.inquiries || []);
      setReplyInputs((prev) => ({
        ...prev,
        [inquiryId]: { isOpen: false, text: '', isSubmitting: false },
      }));
    } catch (err) {
      toast.error('Reply Failed', err.message || 'Could not post reply.');
      setReplyInputs((prev) => ({
        ...prev,
        [inquiryId]: { ...prev[inquiryId], isSubmitting: false },
      }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="broker-hub-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="broker-hub-modal"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glow */}
          <div className="broker-hub-glow" aria-hidden="true" />

          {/* Modal Header */}
          <div className="bhm-header">
            <div className="bhm-broker-info">
              {broker.logo ? (
                <img src={broker.logo} alt={broker.name} className="bhm-logo" />
              ) : (
                <div className="bhm-logo-placeholder">
                  {broker.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="bhm-title-row">
                  <h3 className="bhm-title">{broker.name} Official Broker Hub</h3>
                  <span className="bhm-verified-chip">
                    <CheckCircle2 size={11} strokeWidth={2.8} /> Verified Partner
                  </span>
                </div>
                <p className="bhm-subtitle">
                  Broker Desk Analytics, Promotional Offers & Direct Trader Inquiries
                </p>
              </div>
            </div>

            <button className="bhm-close-btn" onClick={onClose} type="button" aria-label="Close hub">
              <X size={15} />
            </button>
          </div>

          {/* Hub Navigation Tabs */}
          <div className="bhm-nav-tabs">
            <button
              type="button"
              className={`bhm-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={13} />
              <span>Live Traffic & Analytics</span>
            </button>
            <button
              type="button"
              className={`bhm-tab-btn ${activeTab === 'promotion' ? 'active' : ''}`}
              onClick={() => setActiveTab('promotion')}
            >
              <Tag size={13} />
              <span>Exclusive Bonus & Promo</span>
            </button>
            <button
              type="button"
              className={`bhm-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              <MessageCircleQuestion size={13} />
              <span>Trader Q&A Desk ({inquiries.length})</span>
            </button>
          </div>

          {/* TAB 1: LIVE TRAFFIC & PERFORMANCE ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div
              key="tab-analytics"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bhm-tab-content"
            >
              <div className="bhm-stats-grid">
                <div className="bhm-stat-card">
                  <div className="bhm-stat-icon is-orange">
                    <Eye size={18} />
                  </div>
                  <div className="bhm-stat-val">{(broker.profileViews || 12450).toLocaleString()}</div>
                  <div className="bhm-stat-lbl">Live Profile Impressions</div>
                  <div className="bhm-stat-trend">↗ +18% this week</div>
                </div>

                <div className="bhm-stat-card">
                  <div className="bhm-stat-icon is-green">
                    <MousePointerClick size={18} />
                  </div>
                  <div className="bhm-stat-val">{(broker.clicksCount || 1820).toLocaleString()}</div>
                  <div className="bhm-stat-lbl">Trader Leads & Account Clicks</div>
                  <div className="bhm-stat-trend">↗ Direct conversions</div>
                </div>

                <div className="bhm-stat-card">
                  <div className="bhm-stat-icon is-blue">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="bhm-stat-val">{broker.trustScore || 95} / 100</div>
                  <div className="bhm-stat-lbl">TradeSafe Trust Score</div>
                  <div className="bhm-stat-trend">Tier-1 Regulatory Standing</div>
                </div>

                <div className="bhm-stat-card">
                  <div className="bhm-stat-icon is-amber">
                    <Star size={18} />
                  </div>
                  <div className="bhm-stat-val">{broker.rating || 4.8} ★</div>
                  <div className="bhm-stat-lbl">Community Rating</div>
                  <div className="bhm-stat-trend">{broker.reviewsCount || '120+ reviews'}</div>
                </div>
              </div>

              {/* Regulatory Compliance Overview */}
              <div className="bhm-compliance-card">
                <div className="bhm-cc-title">
                  <Award size={15} color="#fc5d21" />
                  <span>Regulatory Standing & Security Parameters</span>
                </div>
                <div className="bhm-cc-grid">
                  <div className="bhm-cc-item">
                    <span className="bhm-cc-lbl">Audited Licenses:</span>
                    <strong className="bhm-cc-val">{broker.regulation || 'FCA, CySEC, ASIC'}</strong>
                  </div>
                  <div className="bhm-cc-item">
                    <span className="bhm-cc-lbl">Execution Routing:</span>
                    <strong className="bhm-cc-val">{broker.executionType || 'STP / ECN Direct'}</strong>
                  </div>
                  <div className="bhm-cc-item">
                    <span className="bhm-cc-lbl">Segregated Funds:</span>
                    <strong className="bhm-cc-val" style={{ color: '#10b981' }}>Tier-1 Tiered Banks</strong>
                  </div>
                  <div className="bhm-cc-item">
                    <span className="bhm-cc-lbl">UPI / IMPS Gateway:</span>
                    <strong className="bhm-cc-val" style={{ color: '#fc5d21' }}>Active & Verified</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: EXCLUSIVE BONUS & PROMOTIONAL OFFER */}
          {activeTab === 'promotion' && (
            <motion.div
              key="tab-promotion"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bhm-tab-content"
            >
              <form onSubmit={handleSavePromo} className="bhm-promo-form">
                <div className="bhm-form-row">
                  <label className="bhm-label">Promotion Headline / Offer Text</label>
                  <input
                    type="text"
                    required
                    className="bhm-input"
                    placeholder="e.g. 100% Deposit Match + 0 Swap Fees on Major Pairs"
                    value={promoHeadline}
                    onChange={(e) => setPromoHeadline(e.target.value)}
                  />
                </div>

                <div className="bhm-form-grid-2">
                  <div className="bhm-form-row">
                    <label className="bhm-label">Promo Voucher Code (Optional)</label>
                    <input
                      type="text"
                      className="bhm-input"
                      placeholder="e.g. PIPWISE100"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </div>
                  <div className="bhm-form-row">
                    <label className="bhm-label">Validity / Expiry Label</label>
                    <input
                      type="text"
                      className="bhm-input"
                      placeholder="e.g. Valid until end of month"
                      value={promoExpiry}
                      onChange={(e) => setPromoExpiry(e.target.value)}
                    />
                  </div>
                </div>

                {/* Live Promo Banner Preview */}
                <div className="bhm-promo-preview-box">
                  <div className="bhm-ppb-tag">Live Card Display Preview</div>
                  <div className="bhm-ppb-card">
                    <div className="bhm-ppb-left">
                      <Sparkles size={16} color="#fc5d21" />
                      <div>
                        <strong>{promoHeadline || 'Zero Swap Fees & Deposit Bonus'}</strong>
                        <div className="bhm-ppb-expiry">{promoExpiry || 'Active this month'}</div>
                      </div>
                    </div>
                    {promoCode && (
                      <span className="bhm-ppb-code">CODE: {promoCode}</span>
                    )}
                  </div>
                </div>

                <div className="bhm-form-actions">
                  <button type="submit" className="bhm-save-btn" disabled={savingPromo}>
                    {savingPromo ? 'Updating Offer...' : 'Publish Promotional Offer'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 3: DIRECT TRADER INQUIRIES & Q&A DESK */}
          {activeTab === 'inquiries' && (
            <motion.div
              key="tab-inquiries"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bhm-tab-content"
            >
              <div className="bhm-inquiries-toolbar">
                <div>
                  <h4 className="bhm-it-title">Direct Trader Inquiries</h4>
                  <p className="bhm-it-desc">
                    Prospective traders ask questions about deposits, spreads, and platforms before opening an account.
                  </p>
                </div>
                <button
                  type="button"
                  className="bhm-ask-btn"
                  onClick={() => setIsAskingQuestion(!isAskingQuestion)}
                >
                  <MessageCircleQuestion size={13} />
                  <span>{isAskingQuestion ? 'Close Form' : 'Ask Question'}</span>
                </button>
              </div>

              {/* Ask Question Form */}
              <AnimatePresence>
                {isAskingQuestion && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAskQuestion}
                    className="bhm-ask-card"
                  >
                    {!isAuthenticated && (
                      <div className="bhm-form-row">
                        <label className="bhm-label">Your Name / Trader Handle</label>
                        <input
                          type="text"
                          required
                          className="bhm-input"
                          placeholder="e.g. Devendra Sharma"
                          value={askerName}
                          onChange={(e) => setAskerName(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="bhm-form-row">
                      <label className="bhm-label">Question for {broker.name} Official Support</label>
                      <textarea
                        rows={2}
                        required
                        className="bhm-textarea"
                        placeholder="e.g. Does your raw account allow High-Frequency scalping EAs with zero latency?"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                      />
                    </div>
                    <div className="bhm-ask-actions">
                      <button
                        type="button"
                        className="bhm-btn-cancel"
                        onClick={() => setIsAskingQuestion(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bhm-btn-send"
                        disabled={submittingInquiry}
                      >
                        <Send size={12} />
                        <span>{submittingInquiry ? 'Sending...' : 'Send to Broker Desk'}</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Inquiries Feed */}
              <div className="bhm-inquiries-feed">
                {inquiries.length === 0 ? (
                  <div className="bhm-empty-inquiries">
                    <MessageCircleQuestion size={32} color="rgba(255,255,255,0.2)" />
                    <h4>No questions posted yet</h4>
                    <p>Have a question about {broker.name}'s spreads, UPI payouts, or leverage? Ask now!</p>
                    <button
                      type="button"
                      className="bhm-empty-ask-btn"
                      onClick={() => setIsAskingQuestion(true)}
                    >
                      Ask First Question
                    </button>
                  </div>
                ) : (
                  inquiries.map((iq) => {
                    const rInput = replyInputs[iq._id];
                    return (
                      <div key={iq._id} className="bhm-inquiry-card">
                        <div className="bhm-iq-top">
                          <div className="bhm-iq-user">
                            <strong>{iq.traderName}</strong>
                            <span className="bhm-iq-date">
                              {new Date(iq.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <span className={`bhm-iq-status ${iq.status}`}>
                            {iq.status === 'answered' ? '✓ Answered' : 'Pending Answer'}
                          </span>
                        </div>

                        <p className="bhm-iq-question">{iq.question}</p>

                        {/* Official Answer */}
                        {iq.answer ? (
                          <div className="bhm-iq-answer-box">
                            <div className="bhm-iq-answer-head">
                              <Building2 size={12} color="#fc5d21" />
                              <strong>Official {broker.name} Desk Answer</strong>
                              <span className="bhm-iq-answered-by">— {iq.answeredBy}</span>
                            </div>
                            <p className="bhm-iq-answer-text">{iq.answer}</p>
                          </div>
                        ) : (
                          <div className="bhm-iq-reply-action">
                            <button
                              type="button"
                              className="bhm-iq-reply-toggle"
                              onClick={() =>
                                setReplyInputs((prev) => ({
                                  ...prev,
                                  [iq._id]: {
                                    isOpen: !prev[iq._id]?.isOpen,
                                    text: prev[iq._id]?.text || '',
                                    isSubmitting: false,
                                  },
                                }))
                              }
                            >
                              <CornerDownRight size={12} />
                              <span>Answer as Broker Desk</span>
                            </button>
                          </div>
                        )}

                        {/* Inline Reply Input */}
                        {rInput?.isOpen && (
                          <div className="bhm-iq-reply-form">
                            <textarea
                              rows={2}
                              placeholder="Write official desk answer to this trader's question..."
                              value={rInput.text}
                              onChange={(e) =>
                                setReplyInputs((prev) => ({
                                  ...prev,
                                  [iq._id]: { ...prev[iq._id], text: e.target.value },
                                }))
                              }
                              className="bhm-textarea"
                            />
                            <div className="bhm-iq-reply-buttons">
                              <button
                                type="button"
                                className="bhm-btn-cancel"
                                onClick={() =>
                                  setReplyInputs((prev) => ({
                                    ...prev,
                                    [iq._id]: { ...prev[iq._id], isOpen: false },
                                  }))
                                }
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="bhm-btn-send"
                                disabled={rInput.isSubmitting}
                                onClick={() => handleReplyInquiry(iq._id)}
                              >
                                <Send size={12} />
                                <span>{rInput.isSubmitting ? 'Posting...' : 'Post Answer'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BrokerHubModal;
