import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  User,
  Sun,
  Moon,
  Search,
  Plus,
  Download,
  Trash2,
  Check,
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  Star,
  Crown,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  Quote,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import useAuth from '../features/auth/hooks/useAuth.js';
import adminService from '../features/admin/services/admin.service.js';
import apiClient from '../features/auth/services/api.client.js';
import {
  INITIAL_DEMO_TESTIMONIALS,
  addDeletedId,
  clearDeletedIds,
  fetchActiveTestimonials,
} from '../features/testimonials/services/testimonialStorage.js';
import './AdminDashboard.css';

// ═══════════════════════════════════════════════════════════════
// MEMOIZED CONFIRMATION MODAL (ZERO LAG, SNAPPY 140MS GPU ANIMATION)
// ═══════════════════════════════════════════════════════════════
const DeleteConfirmModal = React.memo(({ modalData, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {modalData.isOpen && (
        <motion.div
          key="d2-modal-overlay"
          className="d2-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={onClose}
        >
          <motion.div
            key="d2-modal-card"
            className="d2-confirm-modal"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Danger Halo & Badge */}
            <div className="d2-modal-badge-row">
              <div className="d2-modal-icon-halo">
                <AlertTriangle size={24} color="#ef4444" strokeWidth={2.4} />
              </div>
              <div className="d2-modal-title-group">
                <span className="d2-modal-tag">
                  {modalData.type === 'testimonial'
                    ? 'Homepage Animation Testimonial'
                    : modalData.type === 'user'
                    ? 'User Account Deletion'
                    : modalData.type === 'broker'
                    ? 'Broker Directory Listing'
                    : 'Review Moderation'}
                </span>
                <h3>Confirm Permanent Deletion</h3>
              </div>
            </div>

            {/* Target Item Details Preview Box */}
            <div className="d2-modal-target-box">
              <div className="d2-modal-target-label">Target to be permanently deleted:</div>
              <div className="d2-modal-target-name">{modalData.name}</div>
              {modalData.extraInfo && (
                <div className="d2-modal-target-extra">{modalData.extraInfo}</div>
              )}
            </div>

            {/* Warning Context */}
            <p className="d2-modal-caution-text">
              {modalData.type === 'testimonial'
                ? 'This testimonial will be immediately removed from the homepage animated dual-marquee loop and deleted from the database. Live visitors will no longer see this review.'
                : modalData.type === 'user'
                ? 'This trader account will be permanently erased. All authentication tokens and sessions will be invalidated immediately.'
                : modalData.type === 'broker'
                ? 'This broker listing, metadata, and all associated community reviews will be permanently removed from PipWise.'
                : 'This review will be permanently deleted and excluded from public broker metrics.'}
            </p>

            {/* Actions */}
            <div className="d2-confirm-actions">
              <button
                type="button"
                className="d2-modal-cancel-btn"
                onClick={onClose}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="d2-modal-danger-btn"
                onClick={onConfirm}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={14} />
                <span>Yes, Delete Permanently</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  // dock icons: 'dashboard' | 'brokers' | 'users' | 'reviews' | 'analytics' | 'notifications' | 'calendar' | 'profile'
  const [activeDock, setActiveDock] = useState('dashboard');
  // top nav tabs: 'dashboard' | 'brokers' | 'reviews'
  const [activeNav, setActiveNav] = useState('dashboard');

  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('pipwise-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Broker filter tab in Brokers view: 'all' | 'pending' | 'approved' | 'rejected'
  const [brokerStatusFilter, setBrokerStatusFilter] = useState('all');

  // Live Backend Data States (Zero fake data)
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBrokers: 0,
    totalReviews: 0,
    totalTestimonials: 0,
    activeUsers: 0,
    adminCount: 0,
    verifiedBrokers: 0,
    pendingBrokers: 0,
    approvedBrokers: 0,
    rejectedBrokers: 0,
    pendingReviews: 0,
    recentUsers: [],
    recentBrokers: [],
    recentReviews: [],
    pendingBrokersList: [],
  });
  const [brokersList, setBrokersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [testimonialFilter, setTestimonialFilter] = useState('all');
  const [healthData, setHealthData] = useState({
    database: 'connected',
    uptime: 0,
    memory: { heapUsedMB: 0, heapTotalMB: 0 },
  });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'broker' | 'user' | 'review' | 'testimonial'
    id: null,
    name: '',
    extraInfo: '',
  });

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2800);
  }, []);

  // Sync theme
  useEffect(() => {
    try {
      localStorage.setItem('pipwise-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, [theme]);

  // Initial Fetch of Real Admin Data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, brokersRes, usersRes, reviewsRes, healthRes, testimonialsRes] = await Promise.allSettled([
        adminService.getStats(),
        adminService.getBrokers(),
        adminService.getUsers(),
        adminService.getReviews(),
        apiClient.get('/health'),
        adminService.getTestimonials(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (brokersRes.status === 'fulfilled' && brokersRes.value?.data?.brokers) {
        setBrokersList(brokersRes.value.data.brokers);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value?.data?.users) {
        setUsersList(usersRes.value.data.users);
      }
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.data?.reviews) {
        setReviewsList(reviewsRes.value.data.reviews);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value?.data) {
        setHealthData(healthRes.value.data);
      }

      // Load testimonials (live from backend or local storage fallback)
      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value?.data?.testimonials) {
        setTestimonialsList(testimonialsRes.value.data.testimonials);
      } else {
        const fallback = await fetchActiveTestimonials();
        setTestimonialsList(fallback);
      }
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
      const fallback = await fetchActiveTestimonials();
      setTestimonialsList(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Helper to switch view from dock or top nav
  const switchDockView = useCallback((viewKey, label) => {
    setActiveDock(viewKey);
    if (viewKey === 'dashboard') {
      setActiveNav('dashboard');
    } else if (viewKey === 'brokers') {
      setActiveNav('brokers');
    } else if (viewKey === 'reviews') {
      setActiveNav('reviews');
    } else if (viewKey === 'testimonials') {
      setActiveNav('testimonials');
    } else if (viewKey === 'users') {
      setActiveNav('users');
    }
    showToast(`Viewing ${label}`);
  }, [showToast]);

  // Calculate real broker counts
  const pendingBrokers = useMemo(
    () => brokersList.filter((b) => b.status === 'pending'),
    [brokersList]
  );
  const approvedBrokers = useMemo(
    () => brokersList.filter((b) => b.status === 'approved' || b.status === 'active'),
    [brokersList]
  );
  const rejectedBrokers = useMemo(
    () => brokersList.filter((b) => b.status === 'rejected'),
    [brokersList]
  );

  const listingApprovalRate = useMemo(() => {
    if (!brokersList.length) return 100;
    return Math.round((approvedBrokers.length / brokersList.length) * 100);
  }, [brokersList, approvedBrokers]);

  const avgTrustIndex = useMemo(() => {
    if (!brokersList.length) return 92;
    const sum = brokersList.reduce((acc, b) => acc + (Number(b.trustScore) || 85), 0);
    return Math.round(sum / brokersList.length);
  }, [brokersList]);

  // Filtered testimonials for management
  const filteredTestimonials = useMemo(() => {
    return testimonialsList.filter((item) => {
      if (testimonialFilter !== 'all' && item.row !== testimonialFilter) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesRole = item.role?.toLowerCase().includes(q);
        const matchesReview = item.review?.toLowerCase().includes(q);
        return matchesName || matchesRole || matchesReview;
      }
      return true;
    });
  }, [testimonialsList, testimonialFilter, searchQuery]);

  // 1. APPROVE BROKER
  const handleApproveBroker = useCallback(async (broker) => {
    try {
      await adminService.updateBrokerStatus(broker._id, 'approved');
      setBrokersList((prev) =>
        prev.map((b) =>
          b._id === broker._id ? { ...b, status: 'approved', isVerified: true } : b
        )
      );
      setStats((prev) => ({
        ...prev,
        pendingBrokers: Math.max(0, prev.pendingBrokers - 1),
        approvedBrokers: (prev.approvedBrokers || 0) + 1,
      }));
      showToast(`Broker "${broker.name}" approved & published live on PipWise!`);
    } catch (err) {
      showToast(err.message || 'Failed to approve broker');
    }
  }, [showToast]);

  // 2. REJECT BROKER
  const handleRejectBroker = useCallback(async (broker) => {
    try {
      await adminService.updateBrokerStatus(broker._id, 'rejected');
      setBrokersList((prev) =>
        prev.map((b) => (b._id === broker._id ? { ...b, status: 'rejected' } : b))
      );
      setStats((prev) => ({
        ...prev,
        pendingBrokers: Math.max(0, prev.pendingBrokers - 1),
        rejectedBrokers: (prev.rejectedBrokers || 0) + 1,
      }));
      showToast(`Broker "${broker.name}" rejected (hidden from public site)`);
    } catch (err) {
      showToast(err.message || 'Failed to reject broker');
    }
  }, [showToast]);

  // Close Delete Confirmation Modal
  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, type: null, id: null, name: '', extraInfo: '' });
  }, []);

  // 3. PROMPT DELETION MODALS (BROKER, USER, REVIEW, TESTIMONIAL)
  const promptDeleteBroker = useCallback((broker) => {
    setDeleteModal({
      isOpen: true,
      type: 'broker',
      id: broker._id,
      name: broker.name,
      extraInfo: `${broker.platforms || 'MT4/MT5'} • Regulation: ${broker.regulation || 'Tier-1'}`,
    });
  }, []);

  const promptDeleteUser = useCallback((u) => {
    setDeleteModal({
      isOpen: true,
      type: 'user',
      id: u._id,
      name: u.username || u.email,
      extraInfo: `${u.email} • Role: ${u.role === 'admin' ? 'Administrator' : 'Trader'}`,
    });
  }, []);

  const promptDeleteReview = useCallback((rev) => {
    setDeleteModal({
      isOpen: true,
      type: 'review',
      id: rev._id,
      name: `Review for ${rev.brokerName}`,
      extraInfo: `By ${rev.username} • Rating: ${rev.rating}★`,
    });
  }, []);

  const promptDeleteTestimonial = useCallback((item) => {
    setDeleteModal({
      isOpen: true,
      type: 'testimonial',
      id: item._id,
      name: item.name,
      extraInfo: `${item.role} • ${item.row === 'top' ? 'Top Marquee Loop' : 'Bottom Marquee Loop'} • "${item.review ? item.review.slice(0, 75) : ''}..."`,
    });
  }, []);

  // Reset demo testimonials
  const handleResetTestimonials = useCallback(async () => {
    try {
      await adminService.resetDemoTestimonials();
    } catch (e) {
      console.warn('Backend reset failed, resetting local', e);
    }
    clearDeletedIds();
    setTestimonialsList(INITIAL_DEMO_TESTIMONIALS);
    setStats((prev) => ({
      ...prev,
      totalTestimonials: INITIAL_DEMO_TESTIMONIALS.length,
    }));
    showToast('Demo testimonials restored to homepage animation');
  }, [showToast]);

  // Execute Confirmed Delete with 0ms Optimistic UI Latency
  const confirmDeleteAction = useCallback(() => {
    const { type, id, name } = deleteModal;
    if (!id || !type) return;

    // 1. INSTANT 0ms OPTIMISTIC CLOSE (No waiting for network roundtrip!)
    closeDeleteModal();

    // 2. INSTANT 0ms STATE REMOVAL & BACKGROUND DISPATCH
    if (type === 'broker') {
      const prevList = [...brokersList];
      setBrokersList((prev) => prev.filter((b) => b._id !== id));
      setStats((prev) => ({
        ...prev,
        totalBrokers: Math.max(0, prev.totalBrokers - 1),
      }));
      showToast(`Broker "${name}" permanently deleted`);
      adminService.deleteBroker(id).catch((err) => {
        setBrokersList(prevList);
        setStats((prev) => ({ ...prev, totalBrokers: prev.totalBrokers + 1 }));
        showToast(err.message || 'Failed to delete broker');
      });
    } else if (type === 'user') {
      const prevList = [...usersList];
      setUsersList((prev) => prev.filter((u) => u._id !== id));
      setStats((prev) => ({
        ...prev,
        totalUsers: Math.max(0, prev.totalUsers - 1),
      }));
      showToast(`User "${name}" deleted`);
      adminService.deleteUser(id).catch((err) => {
        setUsersList(prevList);
        setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
        showToast(err.message || 'Failed to delete user');
      });
    } else if (type === 'review') {
      const prevList = [...reviewsList];
      setReviewsList((prev) => prev.filter((r) => r._id !== id));
      setStats((prev) => ({
        ...prev,
        totalReviews: Math.max(0, prev.totalReviews - 1),
      }));
      showToast(`Review deleted successfully`);
      adminService.deleteReview(id).catch((err) => {
        setReviewsList(prevList);
        setStats((prev) => ({ ...prev, totalReviews: prev.totalReviews + 1 }));
        showToast(err.message || 'Failed to delete review');
      });
    } else if (type === 'testimonial') {
      addDeletedId(id);
      if (name) addDeletedId(name);
      setTestimonialsList((prev) => prev.filter((t) => t._id !== id && t.name !== name));
      setStats((prev) => ({
        ...prev,
        totalTestimonials: Math.max(0, (prev.totalTestimonials || 1) - 1),
      }));
      showToast(`Testimonial by "${name}" deleted from homepage animation`);
      adminService.deleteTestimonial(id).catch((e) => {
        console.warn('Backend delete failed, local removal remains active', e);
      });
    }
  }, [deleteModal, brokersList, usersList, reviewsList, closeDeleteModal, showToast]);

  // Toggle Broker Verification
  const handleToggleBrokerVerify = useCallback(async (brokerId) => {
    try {
      const res = await adminService.toggleBrokerVerification(brokerId);
      const updated = res.data?.broker;
      if (updated) {
        setBrokersList((prev) =>
          prev.map((b) => (b._id === brokerId ? { ...b, isVerified: updated.isVerified } : b))
        );
        showToast(`Broker ${updated.name} verification updated`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update verification');
    }
  }, [showToast]);

  // Toggle User Role
  const handleToggleUserRole = useCallback(async (userObj) => {
    const newRole = userObj.role === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(userObj._id, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userObj._id ? { ...u, role: newRole } : u))
      );
      showToast(`User "${userObj.username}" is now ${newRole.toUpperCase()}`);
    } catch (err) {
      showToast(err.message || 'Failed to update user role');
    }
  }, [showToast]);

  // Approve Review
  const handleApproveReview = useCallback(async (reviewId) => {
    try {
      await adminService.updateReviewStatus(reviewId, 'approved');
      setReviewsList((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, status: 'approved' } : r))
      );
      showToast('Review approved & published live');
    } catch (err) {
      showToast(err.message || 'Failed to approve review');
    }
  }, [showToast]);

  // Export Data as CSV
  const handleExportData = () => {
    if (activeDock === 'users') {
      const csv =
        'ID,Username,Email,Role,Active,CreatedAt\n' +
        usersList
          .map(
            (u) =>
              `"${u._id}","${u.username}","${u.email}","${u.role}","${u.isActive}","${u.createdAt}"`
          )
          .join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pipwise_users_${Date.now()}.csv`;
      a.click();
      showToast('Exported users data to CSV');
    } else {
      const csv =
        'ID,Name,Status,Rating,MinDeposit,Spread,Leverage,Regulation,Verified\n' +
        brokersList
          .map(
            (b) =>
              `"${b._id}","${b.name}","${b.status}","${b.rating}","${b.minDeposit}","${b.spread}","${b.maxLeverage}","${b.regulation}","${b.isVerified}"`
          )
          .join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pipwise_brokers_${Date.now()}.csv`;
      a.click();
      showToast('Exported brokers records to CSV');
    }
  };

  // Filtered Brokers for Brokers View
  const filteredBrokers = useMemo(() => {
    let list = brokersList;
    if (brokerStatusFilter === 'pending') {
      list = list.filter((b) => b.status === 'pending');
    } else if (brokerStatusFilter === 'approved') {
      list = list.filter((b) => b.status === 'approved' || b.status === 'active');
    } else if (brokerStatusFilter === 'rejected') {
      list = list.filter((b) => b.status === 'rejected');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.slug?.toLowerCase().includes(q) ||
          b.platforms?.toLowerCase().includes(q) ||
          b.regulation?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [brokersList, brokerStatusFilter, searchQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    const q = searchQuery.toLowerCase();
    return usersList.filter(
      (u) => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [usersList, searchQuery]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return reviewsList;
    const q = searchQuery.toLowerCase();
    return reviewsList.filter(
      (r) =>
        r.brokerName?.toLowerCase().includes(q) ||
        r.username?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q)
    );
  }, [reviewsList, searchQuery]);

  return (
    <div className={`d2-canvas ${theme === 'dark' ? 'd2-theme-dark' : ''}`}>
      {/* QUICK SWITCHER BUTTON TO PIPWISE PUBLIC SITE */}
      <Link
        to="/"
        className="d2-dashboard-switcher"
        title="Return to PipWise Public Portal"
      >
        <span>← PipWise Home</span>
      </Link>

      <div className="d2-container">
        {/* ═══════════════════════════════════════════════════════════════
            LEFT CURVED WAVE DOCK (NAVIGATE TO ANY REAL SECTION)
            ═══════════════════════════════════════════════════════════════ */}
        <aside className="d2-sidebar-wrapper" aria-label="Sidebar Dock">
          <svg className="d2-sidebar-bg-svg" viewBox="0 0 80 800" preserveAspectRatio="none">
            <path
              d="M 0,0 
                 L 22,0 
                 C 22,100 80,140 80,240 
                 L 80,600 
                 C 80,700 22,740 22,800 
                 L 0,800 Z"
              fill="#595ef2"
            />
          </svg>

          <div className="d2-sidebar-nav">
            {/* 1. DASHBOARD */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'dashboard' ? 'active' : ''}`}
              onClick={() => switchDockView('dashboard', 'Dashboard Overview')}
              title="Dashboard Overview"
            >
              <LayoutDashboard size={19} />
            </motion.button>

            {/* 2. BROKERS (WITH REAL PENDING COUNT BADGE) */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'brokers' ? 'active' : ''}`}
              onClick={() => switchDockView('brokers', 'Broker Management')}
              title="Brokers Management & Approvals"
            >
              <Building2 size={19} />
              {pendingBrokers.length > 0 ? (
                <span className="d2-pro-badge" style={{ background: '#f59e0b' }}>
                  {pendingBrokers.length} NEW
                </span>
              ) : (
                <span className="d2-pro-badge">{brokersList.length}</span>
              )}
            </motion.button>

            {/* 3. USERS */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'users' ? 'active' : ''}`}
              onClick={() => switchDockView('users', 'Trader & User Management')}
              title="Registered Users"
            >
              <Users size={19} />
              <span className="d2-pro-badge">{usersList.length}</span>
            </motion.button>

            {/* 4. REVIEWS */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'reviews' ? 'active' : ''}`}
              onClick={() => switchDockView('reviews', 'Trader Reviews Moderation')}
              title="Reviews Moderation"
            >
              <MessageSquare size={19} />
              <span className="d2-pro-badge">{reviewsList.length}</span>
            </motion.button>

            {/* 5. TESTIMONIALS (HOMEPAGE ANIMATION) */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'testimonials' ? 'active' : ''}`}
              onClick={() => switchDockView('testimonials', 'Homepage Marquee Testimonials')}
              title="Homepage Animated Testimonials"
            >
              <Quote size={19} />
              <span className="d2-pro-badge">{testimonialsList.length}</span>
            </motion.button>

            {/* 6. ANALYTICS */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'analytics' ? 'active' : ''}`}
              onClick={() => switchDockView('analytics', 'Platform Analytics')}
              title="Forex Market Analytics"
            >
              <BarChart3 size={19} />
            </motion.button>

            {/* 7. NOTIFICATIONS */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'notifications' ? 'active' : ''}`}
              onClick={() => switchDockView('notifications', 'System Notifications')}
              title="Notifications"
            >
              <Bell size={19} />
              {pendingBrokers.length > 0 && <span className="d2-action-dot" />}
            </motion.button>

            {/* 8. PROFILE / SETTINGS */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`d2-dock-item ${activeDock === 'profile' ? 'active' : ''}`}
              onClick={() => switchDockView('profile', 'Admin Profile & Security')}
              title="Admin Profile"
            >
              <User size={19} />
            </motion.button>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════
            MAIN WORKSPACE
            ═══════════════════════════════════════════════════════════════ */}
        <main className="d2-main-workspace">
          {/* HEADER BAR */}
          <header className="d2-header">
            <nav className="d2-nav-links">
              <button
                className={`d2-nav-item ${activeNav === 'dashboard' && activeDock === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('dashboard');
                  setActiveDock('dashboard');
                  showToast('Navigated to Dashboard');
                }}
              >
                <LayoutDashboard size={15} />
                <span>Overview</span>
              </button>

              <button
                className={`d2-nav-item ${activeNav === 'brokers' || activeDock === 'brokers' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('brokers');
                  setActiveDock('brokers');
                  showToast('Navigated to Brokers Management');
                }}
              >
                <Building2 size={15} />
                <span>
                  Brokers ({brokersList.length})
                  {pendingBrokers.length > 0 && (
                    <span style={{ marginLeft: '4px', color: '#f59e0b', fontWeight: 800 }}>
                      • {pendingBrokers.length} Pending
                    </span>
                  )}
                </span>
              </button>

              <button
                className={`d2-nav-item ${activeNav === 'reviews' || activeDock === 'reviews' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('reviews');
                  setActiveDock('reviews');
                  showToast('Navigated to Reviews');
                }}
              >
                <MessageSquare size={15} />
                <span>Reviews ({reviewsList.length})</span>
              </button>

              <button
                className={`d2-nav-item ${activeNav === 'testimonials' || activeDock === 'testimonials' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('testimonials');
                  setActiveDock('testimonials');
                  showToast('Navigated to Homepage Testimonials');
                }}
              >
                <Quote size={15} />
                <span>Marquee Testimonials ({testimonialsList.length})</span>
              </button>
            </nav>

            <div className="d2-search-container">
              <Search size={14} className="d2-search-icon" />
              <input
                type="text"
                className="d2-search-input"
                placeholder={
                  activeDock === 'users'
                    ? 'Search registered users by username/email...'
                    : activeDock === 'reviews'
                    ? 'Search reviews or brokers...'
                    : activeDock === 'testimonials'
                    ? 'Search testimonials by trader name, role, quote...'
                    : 'Search brokers by name, platforms, regulation...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="d2-header-actions">
              {/* THEME TOGGLE */}
              <div className="d2-theme-toggle">
                <button
                  className={`d2-theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={13} strokeWidth={2} />
                  <span>Light</span>
                </button>
                <button
                  className={`d2-theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => {
                    setTheme('dark');
                    showToast('Dark mode enabled');
                  }}
                >
                  <Moon size={13} strokeWidth={2} />
                  <span>Dark</span>
                </button>
              </div>

              {/* NOTIFICATION BELL */}
              <button
                className="d2-action-icon-btn"
                onClick={() => switchDockView('notifications', 'Notifications Center')}
                title="Notifications"
              >
                <Bell size={16} />
                {pendingBrokers.length > 0 && <span className="d2-action-dot" />}
              </button>

              {/* SETTINGS GEAR */}
              <button
                className="d2-action-icon-btn"
                onClick={() => switchDockView('profile', 'Settings & Profile')}
                title="Settings"
              >
                <Settings size={16} />
              </button>

              {/* EXPORT DATA */}
              <button
                className="d2-export-btn"
                onClick={handleExportData}
                title="Export real records to CSV"
              >
                <Download size={13} strokeWidth={2.2} />
                <span>Export</span>
                <span className="d2-xls-tag">.csv</span>
              </button>

              {/* ADD NEW BROKER */}
              <button
                className="d2-add-board-btn"
                onClick={() => navigate('/join-broker')}
                title="Register or test new broker submission"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Broker</span>
              </button>
            </div>
          </header>

          {/* ═══════════════════════════════════════════════════════════════
              DYNAMIC CONTENT VIEW ROUTER (100% REAL DIRECTORY DATA)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="d2-view-viewport">
            <AnimatePresence mode="wait">
              {/* VIEW 1: DASHBOARD OVERVIEW */}
              {activeDock === 'dashboard' && activeNav === 'dashboard' && (
                <motion.div
                  key="view-dashboard"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="d2-content-rows"
                >
                  {/* ROW 1: GREETINGS & REAL STATS CARDS */}
                  <section className="d2-row-top">
                    <div className="d2-greeting-col">
                      <div className="d2-greeting-header">
                        <h2 className="d2-greeting-name">
                          Hi, {user?.username || 'Admin'}!
                        </h2>
                        <div className="d2-avatar-bubbles">
                          <span className="d2-avatar-bubble purple">
                            {(user?.username || 'A')[0].toUpperCase()}
                          </span>
                          <span className="d2-avatar-bubble cyan">
                            <Crown size={14} strokeWidth={2.5} color="#eab308" />
                          </span>
                        </div>
                      </div>
                      <h1 className="d2-greeting-question">
                        PipWise Real-Time
                        <br />
                        Command Center
                      </h1>
                      <p className="d2-greeting-sub">
                        {pendingBrokers.length > 0 ? (
                          <strong style={{ color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <AlertTriangle size={14} strokeWidth={2.5} />
                            <span>{pendingBrokers.length} broker application(s) awaiting your approval!</span>
                          </strong>
                        ) : (
                          `All ${brokersList.length} broker profiles audited and synchronized across global regulatory standards.`
                        )}
                      </p>
                    </div>

                    <div className="d2-feature-cards">
                      {/* CARD 1: ADD BUTTON CARD */}
                      <div
                        className="d2-add-feature-card"
                        onClick={() => navigate('/join-broker')}
                        title="Submit or add new broker"
                      >
                        <div className="d2-add-square-btn">
                          <Plus size={18} strokeWidth={2.5} />
                        </div>
                      </div>

                      {/* CARD 2: REAL BROKERS COUNT */}
                      <div
                        className="d2-feature-card"
                        onClick={() => switchDockView('brokers', 'Brokers')}
                      >
                        <div className="d2-feature-illu">
                          <Building2 size={32} strokeWidth={1.8} color="#595ef2" />
                        </div>
                        <div>
                          <h3 className="d2-feature-card-title">{brokersList.length} Brokers</h3>
                          <p className="d2-feature-card-desc">
                            {approvedBrokers.length} live • {pendingBrokers.length} pending
                          </p>
                        </div>
                      </div>

                      {/* CARD 3: REAL USERS COUNT */}
                      <div
                        className="d2-feature-card"
                        onClick={() => switchDockView('users', 'Users')}
                      >
                        <div className="d2-feature-illu">
                          <Users size={32} strokeWidth={1.8} color="#0284c7" />
                        </div>
                        <div>
                          <h3 className="d2-feature-card-title">{usersList.length} Traders</h3>
                          <p className="d2-feature-card-desc">
                            {usersList.filter((u) => u.role === 'admin').length} admin accounts
                          </p>
                        </div>
                      </div>

                      {/* CARD 4: REAL REVIEWS COUNT */}
                      <div
                        className="d2-feature-card"
                        onClick={() => switchDockView('reviews', 'Reviews')}
                      >
                        <div className="d2-feature-illu">
                          <MessageSquare size={32} strokeWidth={1.8} color="#10b981" />
                        </div>
                        <div>
                          <h3 className="d2-feature-card-title">{reviewsList.length} Reviews</h3>
                          <p className="d2-feature-card-desc">Verified trader feedback</p>
                        </div>
                      </div>

                      {/* CARD 5: REAL MARQUEE TESTIMONIALS */}
                      <div
                        className="d2-feature-card"
                        onClick={() => switchDockView('testimonials', 'Homepage Testimonials')}
                      >
                        <div className="d2-feature-illu">
                          <Quote size={30} strokeWidth={1.8} color="#8b5cf6" />
                        </div>
                        <div>
                          <h3 className="d2-feature-card-title">{testimonialsList.length} Testimonials</h3>
                          <p className="d2-feature-card-desc">Homepage ticker animation</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ROW 2: REAL PENDING APPROVALS QUEUE & ACTIVITY */}
                  <section className="d2-row-mid">
                    {/* COLUMN 1: REAL PENDING BROKER APPROVALS QUEUE */}
                    <div className="d2-col-notifications">
                      <div className="d2-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={15} color="#f59e0b" />
                          <h3 className="d2-card-title">Pending Approvals</h3>
                          {pendingBrokers.length > 0 && (
                            <span className="d2-status-pill pending">
                              {pendingBrokers.length} Action Needed
                            </span>
                          )}
                        </div>
                        <button className="d2-card-header-btn" onClick={() => loadAdminData()}>
                          <span>Refresh</span>
                        </button>
                      </div>

                      {pendingBrokers.length === 0 ? (
                        <div className="d2-upcoming-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                            <CheckCircle2 size={32} color="#10b981" strokeWidth={2} />
                          </div>
                          <strong style={{ fontSize: '12.5px', color: '#10b981' }}>
                            Zero Pending Brokers
                          </strong>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0' }}>
                            All newly created broker applications have been approved and published live.
                          </p>
                        </div>
                      ) : (
                        pendingBrokers.map((broker) => (
                          <div key={broker._id} className="d2-upcoming-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                            <div className="d2-upcoming-top">
                              <div className="d2-upcoming-title">
                                <span>{broker.name}</span>
                                <span className="d2-status-pill pending">Pending</span>
                              </div>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                                {new Date(broker.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="d2-upcoming-desc">
                              {broker.regulation} • Min Dep: {broker.minDeposit} • Spread: {broker.spread}
                              <br />
                              <span style={{ color: '#64748b' }}>
                                Contact: {broker.contactEmail} ({broker.representativeName || 'Partner'})
                              </span>
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                              <button
                                className="d2-btn-approve"
                                onClick={() => handleApproveBroker(broker)}
                                title="Approve and make visible on public website"
                              >
                                <Check size={12} strokeWidth={2.8} />
                                <span>Approve &amp; Go Live</span>
                              </button>
                              <button
                                className="d2-btn-reject"
                                onClick={() => handleRejectBroker(broker)}
                                title="Reject submission"
                              >
                                <X size={12} strokeWidth={2.8} />
                                <span>Reject</span>
                              </button>
                              <button
                                className="d2-btn-delete"
                                onClick={() => promptDeleteBroker(broker)}
                                title="Permanently delete"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* COLUMN 2: REAL RECENT REVIEWS */}
                    <div className="d2-col-assignments">
                      <div className="d2-card-header">
                        <h3 className="d2-card-title">Real Trader Reviews</h3>
                        <button className="d2-card-header-btn" onClick={() => switchDockView('reviews', 'Reviews')}>
                          <span>View All ({reviewsList.length})</span>
                        </button>
                      </div>

                      {reviewsList.slice(0, 2).map((rev) => (
                        <div key={rev._id} className="d2-assignment-card">
                          <div className="d2-assignment-top-row">
                            <div>
                              <h4 className="d2-assignment-title">{rev.brokerName}</h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#eab308', marginTop: '2px' }}>
                                {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                  <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                                ))}
                                <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>
                                  ({rev.title})
                                </span>
                              </div>
                            </div>
                            <span className={`d2-status-pill ${rev.status}`}>
                              {rev.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '10.5px', color: '#64748b', margin: '4px 0 8px', lineHeight: 1.35 }}>
                            "{rev.comment}"
                          </p>
                          <div className="d2-assignment-bottom-row">
                            <span className="d2-package-tag">By {rev.username}</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {rev.status !== 'approved' && (
                                <button
                                  className="d2-btn-approve"
                                  style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                  onClick={() => handleApproveReview(rev._id)}
                                >
                                  <Check size={11} strokeWidth={2.8} />
                                  <span>Approve</span>
                                </button>
                              )}
                              <button
                                className="d2-btn-delete"
                                style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                onClick={() => promptDeleteReview(rev)}
                              >
                                <Trash2 size={11} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COLUMN 3: REAL REGISTERED TRADERS FEED */}
                    <div className="d2-col-schedule">
                      <div className="d2-card-header">
                        <h3 className="d2-card-title">Registered Accounts</h3>
                        <button className="d2-card-header-btn" onClick={() => switchDockView('users', 'Users')}>
                          <span>View All ({usersList.length})</span>
                        </button>
                      </div>

                      <div className="d2-timeline-list">
                        {usersList.slice(0, 4).map((u) => (
                          <div key={u._id} className="d2-event-card">
                            <div className="d2-event-left">
                              <div
                                className="d2-event-icon-box"
                                style={{
                                  background: 'transparent',
                                  color: u.role === 'admin' ? '#8b5cf6' : '#0284c7',
                                }}
                              >
                                {u.role === 'admin' ? (
                                  <Crown size={17} strokeWidth={2.2} />
                                ) : (
                                  <User size={17} strokeWidth={2} />
                                )}
                              </div>
                              <div className="d2-event-info">
                                <span className="d2-event-title">
                                  {u.username}{' '}
                                  <span className={u.role === 'admin' ? 'd2-badge-admin' : 'd2-badge-user'}>
                                    {u.role}
                                  </span>
                                </span>
                                <span className="d2-event-sub">
                                  {u.email} • {new Date(u.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <button
                                className={u.role === 'admin' ? 'd2-btn-demote' : 'd2-btn-promote'}
                                style={{ padding: '3px 8px', fontSize: '10px' }}
                                onClick={() => handleToggleUserRole(u)}
                                title={u.role === 'admin' ? 'Demote to regular trader' : 'Promote to administrator'}
                              >
                                {u.role === 'admin' ? (
                                  <>
                                    <UserMinus size={11} />
                                    <span>Demote</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus size={11} />
                                    <span>Promote</span>
                                  </>
                                )}
                              </button>
                              <button
                                className="d2-btn-delete"
                                style={{ padding: '3px 7px', fontSize: '10px' }}
                                onClick={() => promptDeleteUser(u)}
                                disabled={user?._id === u._id}
                                title={user?._id === u._id ? 'You cannot delete yourself' : 'Delete user account'}
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* ROW 3: REAL BROKERS LIST WITH APPROVE / REJECT / DELETE */}
                  <section className="d2-row-bottom">
                    {/* ALL BROKERS REAL LIST */}
                    <div className="d2-col-today-tasks">
                      <div className="d2-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 className="d2-card-title">Live Broker Directory</h3>
                          <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                            ({brokersList.length} in DB)
                          </span>
                        </div>
                        <button className="d2-card-header-btn" onClick={() => switchDockView('brokers', 'Brokers')}>
                          <span>Full Manager →</span>
                        </button>
                      </div>

                      {brokersList.slice(0, 5).map((broker) => (
                        <div key={broker._id} className="d2-task-row">
                          <div className="d2-task-name-col">
                            <span className="d2-task-name">
                              {broker.name}{' '}
                              <span className={`d2-status-pill ${broker.status || 'approved'}`}>
                                {broker.status || 'approved'}
                              </span>
                            </span>
                            <span className="d2-task-date">
                              Min: {broker.minDeposit} • Spread: {broker.spread} • {broker.regulation}
                            </span>
                          </div>

                          <div className="d2-task-duration-col">
                            <span className="d2-task-duration-label">Rating</span>
                            <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Star size={11} fill="#10b981" color="#10b981" />
                              <span>{broker.rating}</span>
                            </span>
                          </div>

                          <div className="d2-task-meta-col" style={{ gap: '6px' }}>
                            {broker.status === 'pending' ? (
                              <>
                                <button
                                  className="d2-btn-approve"
                                  style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                  onClick={() => handleApproveBroker(broker)}
                                  title="Approve broker"
                                >
                                  <Check size={11} strokeWidth={2.8} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  className="d2-btn-reject"
                                  style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                  onClick={() => handleRejectBroker(broker)}
                                  title="Reject broker"
                                >
                                  <X size={11} strokeWidth={2.8} />
                                  <span>Reject</span>
                                </button>
                              </>
                            ) : broker.status === 'rejected' ? (
                              <button
                                className="d2-btn-approve"
                                style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                onClick={() => handleApproveBroker(broker)}
                                title="Re-approve broker"
                              >
                                <Check size={11} strokeWidth={2.8} />
                                <span>Approve</span>
                              </button>
                            ) : (
                              <button
                                className="d2-btn-reject"
                                style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                onClick={() => handleRejectBroker(broker)}
                                title="Unpublish from live site"
                              >
                                <X size={11} strokeWidth={2.8} />
                                <span>Reject</span>
                              </button>
                            )}

                            {/* Delete Broker */}
                            <button
                              className="d2-quick-del-btn"
                              onClick={() => promptDeleteBroker(broker)}
                              title={`Delete ${broker.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* REAL PLATFORM SUMMARY CARD */}
                    <div className="d2-premium-card">
                      <div className="d2-premium-illu">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="d2-premium-title">PipWise Security Gateway</h3>
                        <p className="d2-premium-desc">
                          Only approved brokers are displayed to public visitors. Pending applications stay in admin staging until verified.
                        </p>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>• Active & Approved: {approvedBrokers.length}</span>
                        <span>• Pending Review: {pendingBrokers.length}</span>
                        <span>• Rejected: {rejectedBrokers.length}</span>
                      </div>
                    </div>

                    {/* DIRECTORY COMPLIANCE & TRUST METRICS */}
                    <div className="d2-col-metrics-meeting">
                      <div className="d2-gauges-card">
                        <div className="d2-gauge-item">
                          <div className="d2-donut-wrapper">
                            <svg className="d2-donut-svg" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray={`${listingApprovalRate}, 100`} strokeLinecap="round" />
                            </svg>
                            <span className="d2-donut-pct">{listingApprovalRate}%</span>
                          </div>
                          <div className="d2-gauge-info">
                            <span className="d2-gauge-category cyan">APPROVAL</span>
                            <span className="d2-gauge-title">Listing Rate</span>
                            <span className="d2-gauge-sub">{approvedBrokers.length} Live • {pendingBrokers.length} Staged</span>
                          </div>
                        </div>

                        <div className="d2-gauge-item">
                          <div className="d2-donut-wrapper">
                            <svg className="d2-donut-svg" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#595ef2" strokeWidth="3.5" strokeDasharray={`${avgTrustIndex}, 100`} strokeLinecap="round" />
                            </svg>
                            <span className="d2-donut-pct">{avgTrustIndex}%</span>
                          </div>
                          <div className="d2-gauge-info">
                            <span className="d2-gauge-category purple">TRUST INDEX</span>
                            <span className="d2-gauge-title">Trader Confidence</span>
                            <span className="d2-gauge-sub">Tier-1 Audited Listings</span>
                          </div>
                        </div>
                      </div>

                      <div className="d2-board-meeting-card">
                        <div className="d2-meeting-title-row">
                          <h4 className="d2-meeting-title">Directory Governance</h4>
                          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>
                            VERIFIED
                          </span>
                        </div>
                        <div className="d2-meeting-time">
                          <span style={{ color: '#10b981', fontSize: '12px' }}>•</span>
                          <span>Tier-1 Regulation Standard (FCA • CySEC • ASIC)</span>
                        </div>
                        <p className="d2-meeting-desc">
                          Broker listing audit active • Trader protection policy enforced • Daily compliance check operational
                        </p>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {/* VIEW 2: BROKERS MANAGEMENT VIEW (FULL APPROVE, REJECT, DELETE CONTROL) */}
              {(activeDock === 'brokers' || (activeNav === 'brokers' && activeDock === 'dashboard')) && (
                <motion.div
                  key="view-brokers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="d2-generic-view"
                >
                  <div className="d2-view-banner">
                    <div className="d2-view-banner-text">
                      <h2>Forex Brokers Directory ({filteredBrokers.length})</h2>
                      <p>
                        Approve new partner submissions, reject unverified broker applications, or permanently delete records
                      </p>
                    </div>
                    <button className="d2-banner-btn" onClick={() => navigate('/join-broker')}>
                      <Plus size={13} strokeWidth={2.5} />
                      <span>Add New Broker</span>
                    </button>
                  </div>

                  {/* STATUS FILTER TABS */}
                  <div className="d2-filter-tabs">
                    <button
                      className={`d2-tab-btn ${brokerStatusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setBrokerStatusFilter('all')}
                    >
                      All ({brokersList.length})
                    </button>
                    <button
                      className={`d2-tab-btn ${brokerStatusFilter === 'pending' ? 'active' : ''}`}
                      onClick={() => setBrokerStatusFilter('pending')}
                      style={{
                        color: pendingBrokers.length > 0 ? '#d97706' : undefined,
                        fontWeight: pendingBrokers.length > 0 ? 800 : undefined,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Clock size={12} strokeWidth={2.5} />
                      <span>Pending Approvals ({pendingBrokers.length})</span>
                    </button>
                    <button
                      className={`d2-tab-btn ${brokerStatusFilter === 'approved' ? 'active' : ''}`}
                      onClick={() => setBrokerStatusFilter('approved')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <CheckCircle2 size={12} strokeWidth={2.5} color="#10b981" />
                      <span>Live &amp; Approved ({approvedBrokers.length})</span>
                    </button>
                    <button
                      className={`d2-tab-btn ${brokerStatusFilter === 'rejected' ? 'active' : ''}`}
                      onClick={() => setBrokerStatusFilter('rejected')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <XCircle size={12} strokeWidth={2.5} color="#ef4444" />
                      <span>Rejected ({rejectedBrokers.length})</span>
                    </button>
                  </div>

                  <div className="d2-management-list">
                    {filteredBrokers.length === 0 ? (
                      <div className="d2-view-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
                        <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                          No brokers match the selected status filter "{brokerStatusFilter}".
                        </p>
                      </div>
                    ) : (
                      filteredBrokers.map((broker) => (
                        <div key={broker._id} className="d2-admin-item-card">
                          <div className="d2-item-primary">
                            <div
                              className="d2-item-avatar-box"
                              style={{ background: 'transparent', color: broker.brandColor || '#595ef2' }}
                            >
                              <Building2 size={20} strokeWidth={2} />
                            </div>
                            <div className="d2-item-info">
                              <span className="d2-item-title">
                                {broker.rank ? `${broker.rank} ` : ''}
                                {broker.name}
                                <span className={`d2-status-pill ${broker.status || 'approved'}`}>
                                  {broker.status || 'approved'}
                                </span>
                                {broker.isVerified && (
                                  <span className="d2-badge-verified">Verified Partner</span>
                                )}
                              </span>
                              <span className="d2-item-sub">
                                {broker.regulation} • {broker.platforms} • Contact: {broker.contactEmail}
                              </span>
                            </div>
                          </div>

                          <div className="d2-item-metrics">
                            <div className="d2-metric-pill">
                              <span className="d2-metric-pill-label">Rating</span>
                              <span className="d2-metric-pill-val" style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <Star size={11} fill="#10b981" color="#10b981" />
                                <span>{broker.rating} ({broker.reviewsCount})</span>
                              </span>
                            </div>
                            <div className="d2-metric-pill">
                              <span className="d2-metric-pill-label">Min Deposit</span>
                              <span className="d2-metric-pill-val">{broker.minDeposit}</span>
                            </div>
                            <div className="d2-metric-pill">
                              <span className="d2-metric-pill-label">Spread</span>
                              <span className="d2-metric-pill-val">{broker.spread}</span>
                            </div>
                            <div className="d2-metric-pill">
                              <span className="d2-metric-pill-label">Leverage</span>
                              <span className="d2-metric-pill-val">{broker.maxLeverage}</span>
                            </div>
                          </div>

                          <div className="d2-item-actions">
                            {/* APPROVE BUTTON (IF PENDING OR REJECTED) */}
                            {broker.status !== 'approved' && broker.status !== 'active' && (
                              <button
                                className="d2-btn-approve"
                                onClick={() => handleApproveBroker(broker)}
                                title="Approve broker and publish live on public website"
                              >
                                <Check size={12} strokeWidth={2.8} />
                                <span>Approve &amp; Go Live</span>
                              </button>
                            )}

                            {/* REJECT BUTTON (IF PENDING OR APPROVED) */}
                            {broker.status !== 'rejected' && (
                              <button
                                className="d2-btn-reject"
                                onClick={() => handleRejectBroker(broker)}
                                title="Reject broker application"
                              >
                                <X size={12} strokeWidth={2.8} />
                                <span>Reject</span>
                              </button>
                            )}

                            {/* TOGGLE VERIFIED BADGE */}
                            <button
                              className="d2-btn-action"
                              onClick={() => handleToggleBrokerVerify(broker._id)}
                              title="Toggle verified partner badge"
                            >
                              {broker.isVerified ? 'Revoke Badge' : 'Verify'}
                            </button>

                            {/* DELETE BROKER BUTTON */}
                            <button
                              className="d2-btn-delete"
                              onClick={() => promptDeleteBroker(broker)}
                              title={`Delete ${broker.name} permanently`}
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* VIEW 3: USERS MANAGEMENT VIEW */}
              {activeDock === 'users' && (
                <motion.div
                  key="view-users"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="d2-generic-view"
                >
                  <div className="d2-view-banner">
                    <div className="d2-view-banner-text">
                      <h2>Registered Users & Community Traders ({filteredUsers.length})</h2>
                      <p>Manage registered trader accounts, institutional partner roles, and administrative permissions</p>
                    </div>
                    <button className="d2-banner-btn" onClick={handleExportData}>
                      Export Users CSV
                    </button>
                  </div>

                  <div className="d2-management-list">
                    {filteredUsers.map((u) => (
                      <div key={u._id} className="d2-admin-item-card">
                        <div className="d2-item-primary">
                          <div
                            className="d2-item-avatar-box"
                            style={{
                              background: 'transparent',
                              color: u.role === 'admin' ? '#8b5cf6' : '#0284c7',
                            }}
                          >
                            {u.role === 'admin' ? <Crown size={20} strokeWidth={2.2} /> : <User size={20} strokeWidth={2} />}
                          </div>
                          <div className="d2-item-info">
                            <span className="d2-item-title">
                              {u.username}
                              {u.role === 'admin' ? (
                                <span className="d2-badge-admin">Admin</span>
                              ) : (
                                <span className="d2-badge-user">Trader</span>
                              )}
                              {!u.isActive && (
                                <span style={{ fontSize: '9px', background: '#fee2e2', color: '#ef4444', padding: '1px 6px', borderRadius: '4px' }}>
                                  Deactivated
                                </span>
                              )}
                            </span>
                            <span className="d2-item-sub">{u.email}</span>
                          </div>
                        </div>

                        <div className="d2-item-metrics">
                          <div className="d2-metric-pill">
                            <span className="d2-metric-pill-label">Account ID</span>
                            <span className="d2-metric-pill-val" style={{ fontFamily: 'monospace', fontSize: '10px' }}>
                              {u._id.slice(-8)}
                            </span>
                          </div>
                          <div className="d2-metric-pill">
                            <span className="d2-metric-pill-label">Member Since</span>
                            <span className="d2-metric-pill-val">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="d2-item-actions">
                          {/* Toggle Admin Role */}
                          <button
                            className={u.role === 'admin' ? 'd2-btn-demote' : 'd2-btn-promote'}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            onClick={() => handleToggleUserRole(u)}
                            title={u.role === 'admin' ? 'Demote to regular trader account' : 'Promote to administrator privileges'}
                          >
                            {u.role === 'admin' ? (
                              <>
                                <UserMinus size={12} />
                                <span>Demote to Trader</span>
                              </>
                            ) : (
                              <>
                                <UserPlus size={12} />
                                <span>Promote to Admin</span>
                              </>
                            )}
                          </button>

                          {/* Delete User */}
                          <button
                            className="d2-btn-delete"
                            onClick={() => promptDeleteUser(u)}
                            disabled={user?._id === u._id}
                            title={user?._id === u._id ? 'You cannot delete yourself' : 'Delete user'}
                            style={{ opacity: user?._id === u._id ? 0.4 : 1, cursor: user?._id === u._id ? 'not-allowed' : 'pointer' }}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* VIEW 4: REVIEWS MODERATION VIEW */}
              {(activeDock === 'reviews' || (activeNav === 'reviews' && activeDock === 'dashboard')) && (
                <motion.div
                  key="view-reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="d2-generic-view"
                >
                  <div className="d2-view-banner">
                    <div className="d2-view-banner-text">
                      <h2>Trader Reviews Moderation ({filteredReviews.length})</h2>
                      <p>Inspect feedback submitted by forex traders, verify UPI deposits, and moderate comments</p>
                    </div>
                    <button className="d2-banner-btn" onClick={() => loadAdminData()}>
                      Refresh Reviews
                    </button>
                  </div>

                  <div className="d2-management-list">
                    {filteredReviews.map((rev) => (
                      <div key={rev._id} className="d2-admin-item-card" style={{ alignItems: 'flex-start' }}>
                        <div className="d2-item-primary" style={{ flex: 2 }}>
                          <div
                            className="d2-item-avatar-box"
                            style={{ background: 'transparent', color: '#eab308' }}
                          >
                            <Star size={20} fill="#eab308" strokeWidth={0} />
                          </div>
                          <div className="d2-item-info">
                            <span className="d2-item-title">
                              {rev.brokerName}
                              <span style={{ color: '#eab308', display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '6px' }}>
                                {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                  <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                                ))}
                              </span>
                              <span className={`d2-status-pill ${rev.status}`}>
                                {rev.status.toUpperCase()}
                              </span>
                            </span>
                            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', margin: '3px 0 2px' }}>
                              "{rev.title}"
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                              {rev.comment}
                            </span>
                            <span className="d2-item-sub" style={{ marginTop: '4px' }}>
                              By {rev.username} ({rev.userEmail || 'trader'}) • Deposit Method: {rev.depositMethodUsed}
                            </span>
                          </div>
                        </div>

                        <div className="d2-item-actions" style={{ alignSelf: 'center' }}>
                          {rev.status !== 'approved' && (
                            <button
                              className="d2-btn-approve"
                              onClick={() => handleApproveReview(rev._id)}
                            >
                              <Check size={12} strokeWidth={2.8} />
                              <span>Approve</span>
                            </button>
                          )}

                          <button
                            className="d2-btn-delete"
                            onClick={() => promptDeleteReview(rev)}
                            title="Delete review"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* VIEW: TESTIMONIALS (HOMEPAGE ANIMATION MARQUEE) */}
              {(activeDock === 'testimonials' || (activeNav === 'testimonials' && activeDock === 'dashboard')) && (
                <motion.div
                  key="view-testimonials"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="d2-generic-view"
                >
                  <div className="d2-view-banner">
                    <div className="d2-view-banner-text">
                      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Quote size={20} color="#595ef2" />
                        <span>Homepage Marquee Testimonials ({filteredTestimonials.length})</span>
                      </h2>
                      <p>
                        Manage real trader testimonials displayed on the homepage dual-track animation loop.
                        Delete any demo or outdated review with immediate real-time sync.
                      </p>
                    </div>
                    <button
                      className="d2-banner-btn"
                      onClick={handleResetTestimonials}
                      title="Restore original 12 demo testimonials"
                    >
                      <RefreshCw size={13} style={{ marginRight: '6px' }} />
                      Reset Demo Testimonials
                    </button>
                  </div>

                  {/* Filter Row */}
                  <div className="d2-filter-bar">
                    <div className="d2-filter-tabs">
                      <button
                        className={`d2-filter-pill ${testimonialFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setTestimonialFilter('all')}
                      >
                        All Testimonials ({testimonialsList.length})
                      </button>
                      <button
                        className={`d2-filter-pill ${testimonialFilter === 'top' ? 'active' : ''}`}
                        onClick={() => setTestimonialFilter('top')}
                      >
                        Top Track (Leftward Loop) ({testimonialsList.filter((t) => t.row === 'top').length})
                      </button>
                      <button
                        className={`d2-filter-pill ${testimonialFilter === 'bottom' ? 'active' : ''}`}
                        onClick={() => setTestimonialFilter('bottom')}
                      >
                        Bottom Track (Rightward Loop) ({testimonialsList.filter((t) => t.row === 'bottom').length})
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Showing {filteredTestimonials.length} active testimonials
                    </div>
                  </div>

                  {/* Grid of Testimonials */}
                  <div className="d2-testimonials-grid">
                    {filteredTestimonials.length === 0 ? (
                      <div className="d2-empty-state" style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center' }}>
                        <Quote size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>No Testimonials Found</h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
                          All testimonials in this filter have been deleted or none match your search.
                        </p>
                        <button className="d2-btn-action" onClick={handleResetTestimonials}>
                          <RefreshCw size={13} />
                          <span>Restore Demo Testimonials</span>
                        </button>
                      </div>
                    ) : (
                      filteredTestimonials.map((item) => (
                        <div key={item._id || item.name} className="d2-testimonial-manage-card">
                          <div className="d2-testimonial-card-top">
                            <div className="d2-testimonial-avatar-area">
                              <img
                                src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                                alt={item.name}
                                className="d2-testimonial-thumb"
                              />
                              <div>
                                <div className="d2-testimonial-author-name">{item.name}</div>
                                <div className="d2-testimonial-author-role">{item.role}</div>
                              </div>
                            </div>
                            <span className={`d2-row-tag ${item.row === 'top' ? 'top-track' : 'bottom-track'}`}>
                              {item.row === 'top' ? 'Top Loop' : 'Bottom Loop'}
                            </span>
                          </div>

                          <div className="d2-testimonial-rating-row">
                            <div className="d2-stars-cluster">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={13} fill="#eab308" color="#eab308" />
                              ))}
                            </div>
                            <span className="d2-rating-val">{item.rating || '5.0'} / 5.0</span>
                          </div>

                          <p className="d2-testimonial-quote">
                            "{item.review}"
                          </p>

                          <div className="d2-testimonial-card-bottom">
                            <span className="d2-demo-pill">
                              {item.isDemo !== false ? 'Demo Testimonial' : 'Live Trader'}
                            </span>
                            <button
                              className="d2-btn-delete"
                              onClick={() => promptDeleteTestimonial(item)}
                              title="Delete this testimonial from the homepage animation"
                            >
                              <Trash2 size={13} />
                              <span>Delete Testimonial</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* VIEW 5: ANALYTICS VIEW */}
              {activeDock === 'analytics' && (
                <motion.div
                  key="view-analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="d2-generic-view"
                >
                  <div className="d2-view-banner">
                    <div className="d2-view-banner-text">
                      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart3 size={20} color="#595ef2" />
                        <span>PipWise Platform &amp; Directory Analytics</span>
                      </h2>
                      <p>Aggregated real data across broker listings, trader engagement, and broker statuses</p>
                    </div>
                    <button className="d2-banner-btn" onClick={() => showToast('Generated full CSV export')}>
                      Export Report
                    </button>
                  </div>

                  <div className="d2-kpi-strip">
                    <div className="d2-kpi-card">
                      <div className="d2-kpi-title">Total Brokers</div>
                      <div className="d2-kpi-value">
                        {brokersList.length} <span className="d2-kpi-change up">Profiles</span>
                      </div>
                    </div>
                    <div className="d2-kpi-card">
                      <div className="d2-kpi-title">Approved & Live</div>
                      <div className="d2-kpi-value">
                        {approvedBrokers.length} <span className="d2-kpi-change up">Public</span>
                      </div>
                    </div>
                    <div className="d2-kpi-card">
                      <div className="d2-kpi-title">Pending Approvals</div>
                      <div className="d2-kpi-value">
                        {pendingBrokers.length} <span className="d2-kpi-change down">Staged</span>
                      </div>
                    </div>
                    <div className="d2-kpi-card">
                      <div className="d2-kpi-title">Registered Accounts</div>
                      <div className="d2-kpi-value">
                        {usersList.length} <span className="d2-kpi-change up">Users</span>
                      </div>
                    </div>
                  </div>

                  <div className="d2-generic-grid-2">
                    <div className="d2-view-card">
                      <h3>Broker Status Distribution</h3>
                      <div className="d2-channel-item">
                        <span className="d2-channel-name">Live Approved Brokers</span>
                        <span className="d2-channel-pct" style={{ color: '#10b981' }}>
                          {approvedBrokers.length} ({brokersList.length > 0 ? Math.round((approvedBrokers.length / brokersList.length) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="d2-channel-item">
                        <span className="d2-channel-name">Pending Admin Review</span>
                        <span className="d2-channel-pct" style={{ color: '#f59e0b' }}>
                          {pendingBrokers.length} ({brokersList.length > 0 ? Math.round((pendingBrokers.length / brokersList.length) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="d2-channel-item">
                        <span className="d2-channel-name">Rejected Submissions</span>
                        <span className="d2-channel-pct" style={{ color: '#ef4444' }}>
                          {rejectedBrokers.length} ({brokersList.length > 0 ? Math.round((rejectedBrokers.length / brokersList.length) * 100) : 0}%)
                        </span>
                      </div>
                    </div>

                    <div className="d2-view-card">
                      <h3>Directory &amp; Trust Metrics</h3>
                      <div className="d2-channel-item">
                        <span className="d2-channel-name">Community Reviews</span>
                        <span className="d2-channel-pct" style={{ color: '#595ef2' }}>
                          {reviewsList.length} Verified
                        </span>
                      </div>
                      <div className="d2-channel-item">
                        <span className="d2-channel-name">Avg Broker Trust Score</span>
                        <span className="d2-channel-pct" style={{ color: '#10b981' }}>
                          {brokersList.length > 0
                            ? (brokersList.reduce((acc, b) => acc + (Number(b.trustScore) || 85), 0) / brokersList.length).toFixed(1)
                            : '94.0'} / 100
                        </span>
                      </div>
                      <div className="d2-channel-item">
                        <span className="d2-channel-name">Tier-1 Regulated Ratio</span>
                        <span className="d2-channel-pct" style={{ color: '#0ea5e9' }}>
                          {brokersList.length > 0
                            ? Math.round(
                                (brokersList.filter((b) => b.isRegulated || (b.regulation && b.regulation.length > 0)).length /
                                  brokersList.length) *
                                  100
                              )
                            : 100}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VIEW 6: NOTIFICATIONS VIEW */}
              {activeDock === 'notifications' && (
                <motion.div
                  key="view-notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="d2-generic-view"
                >
                  <div className="d2-view-banner">
                    <div className="d2-view-banner-text">
                      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={20} color="#f59e0b" />
                        <span>System Alerts &amp; Activity</span>
                      </h2>
                      <p>Real-time operational alerts on pending broker approvals and directory activity</p>
                    </div>
                    <button className="d2-banner-btn" onClick={() => loadAdminData()}>
                      Sync Alerts
                    </button>
                  </div>

                  <div className="d2-notif-stack">
                    {pendingBrokers.length > 0 && (
                      <div className="d2-notif-center-item" onClick={() => switchDockView('brokers', 'Brokers')} style={{ cursor: 'pointer', borderLeft: '4px solid #f59e0b' }}>
                        <span className="d2-notif-dot amber" />
                        <div className="d2-notif-center-text">
                          <strong>{pendingBrokers.length} Broker(s) Awaiting Review</strong>
                          <span>Click to open broker approval staging and publish live</span>
                        </div>
                      </div>
                    )}
                    <div className="d2-notif-center-item">
                      <span className="d2-notif-dot green" />
                      <div className="d2-notif-center-text">
                        <strong>Directory Inventory Synchronized</strong>
                        <span>{brokersList.length} live broker profiles and {usersList.length} registered accounts</span>
                      </div>
                    </div>
                    <div className="d2-notif-center-item">
                      <span className="d2-notif-dot purple" />
                      <div className="d2-notif-center-text">
                        <strong>Super Administrator Authenticated</strong>
                        <span>Active session for {user?.email}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VIEW 7: ADMIN PROFILE & SECURITY */}
              {activeDock === 'profile' && (
                <motion.div
                  key="view-profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="d2-generic-view"
                >
                  <div className="d2-view-banner">
                    <div className="d2-view-banner-text">
                      <h2>Administrator Credentials & Security</h2>
                      <p>Manage your PipWise admin profile, authentication tokens, and system preferences</p>
                    </div>
                    <button
                      className="d2-banner-btn"
                      onClick={() => {
                        logout();
                        navigate('/');
                        showToast('Signed out of admin dashboard');
                      }}
                    >
                      Sign Out
                    </button>
                  </div>

                  <div className="d2-generic-grid-2">
                    <div className="d2-view-card">
                      <h3>Admin Profile Information</h3>
                      <div className="d2-info-row">
                        <span className="d2-info-label">Username</span>
                        <span className="d2-info-value">{user?.username || 'admin'}</span>
                      </div>
                      <div className="d2-info-row">
                        <span className="d2-info-label">Email Address</span>
                        <span className="d2-info-value">{user?.email || 'admin@pipwise.com'}</span>
                      </div>
                      <div className="d2-info-row">
                        <span className="d2-info-label">Role Privilege</span>
                        <span className="d2-info-value" style={{ color: '#10b981' }}>
                          Super Administrator (Full Approval Authority)
                        </span>
                      </div>
                      <div className="d2-info-row">
                        <span className="d2-info-label">Account ID</span>
                        <span className="d2-info-value" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                          {user?._id || 'Master'}
                        </span>
                      </div>
                    </div>

                    <div className="d2-view-card">
                      <h3>Platform Inventory Summary</h3>
                      <div className="d2-stat-grid">
                        <div className="d2-stat-item">
                          <span className="d2-stat-num">{brokersList.length}</span>
                          <span className="d2-stat-label">Total Listed Brokers</span>
                        </div>
                        <div className="d2-stat-item">
                          <span className="d2-stat-num">{pendingBrokers.length}</span>
                          <span className="d2-stat-label">Pending Approval</span>
                        </div>
                        <div className="d2-stat-item">
                          <span className="d2-stat-num">{approvedBrokers.length}</span>
                          <span className="d2-stat-label">Live on Website</span>
                        </div>
                        <div className="d2-stat-item">
                          <span className="d2-stat-num">{usersList.length}</span>
                          <span className="d2-stat-label">Registered Traders</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* PROFESSIONAL CONFIRMATION MODAL (PERMANENT DELETE BROKER / USER / REVIEW / TESTIMONIAL) */}
      <DeleteConfirmModal
        modalData={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteAction}
      />

      {/* TOAST FEEDBACK */}
      {toast.show && (
        <div className="d2-toast">
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
