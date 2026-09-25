import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import adminService from '../../admin/services/admin.service.js';
import { useToast } from '../../shared/components/toast/ToastContext.jsx';
import { ShieldAlert, ShieldCheck, Lock, ArrowLeft, Sparkles } from 'lucide-react';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isInitialChecking, openLogin, verifySession } = useAuth();
  const toast = useToast();
  const [promoting, setPromoting] = useState(false);

  // If initial auth session is still being checked from cookie/storage
  if (isInitialChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #0f172a)',
        color: '#fff',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '3px solid rgba(89, 94, 242, 0.25)',
            borderTopColor: '#595ef2',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Verifying Administrator Privileges...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0f19',
        padding: '20px',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif'
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          background: '#151d30',
          borderRadius: '24px',
          padding: '36px 32px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'rgba(89, 94, 242, 0.15)',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>
            PipWise Admin Portal
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px' }}>
            This section is restricted to PipWise platform administrators. Please log in with administrator credentials.
          </p>

          <div style={{
            background: 'rgba(89, 94, 242, 0.08)',
            border: '1px dashed rgba(89, 94, 242, 0.3)',
            borderRadius: '14px',
            padding: '12px',
            fontSize: '11.5px',
            color: '#cbd5e1',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <strong style={{ color: '#818cf8', display: 'block', marginBottom: '4px' }}>
              🔑 Default Admin Credentials:
            </strong>
            Email: <code style={{ color: '#38bdf8' }}>admin@pipwise.com</code><br />
            Password: <code style={{ color: '#38bdf8' }}>admin123</code>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={openLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #595ef2 0%, #7c5cf2 100%)',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(89, 94, 242, 0.4)'
              }}
            >
              Sign In as Administrator
            </button>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#94a3b8',
                fontSize: '12px',
                textDecoration: 'none',
                marginTop: '6px'
              }}
            >
              <ArrowLeft size={13} /> Back to PipWise Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not role 'admin'
  if (user?.role !== 'admin') {
    const handlePromoteSelf = async () => {
      try {
        setPromoting(true);
        const res = await adminService.promoteMe();
        toast.success('Admin Role Granted!', 'Your account has been elevated to Administrator.');
        await verifySession();
      } catch (err) {
        toast.error('Error', err.message || 'Failed to elevate privileges');
      } finally {
        setPromoting(false);
      }
    };

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0f19',
        padding: '20px',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          background: '#151d30',
          borderRadius: '24px',
          padding: '36px 32px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <ShieldAlert size={28} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>
            Administrator Access Required
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 20px' }}>
            You are signed in as <strong style={{ color: '#fff' }}>{user.username}</strong> ({user.email}), but this account currently has the standard <code style={{ color: '#f59e0b' }}>"{user.role || 'user'}"</code> role.
          </p>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="#10b981" />
              <strong style={{ color: '#10b981', fontSize: '12.5px' }}>Instant Development Upgrade</strong>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              Want to manage brokers and reviews with this current account? Click below to promote your account to Admin immediately.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handlePromoteSelf}
              disabled={promoting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
              }}
            >
              {promoting ? 'Promoting Account...' : '✨ Elevate This Account to Admin'}
            </button>

            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#94a3b8',
                fontSize: '12px',
                textDecoration: 'none',
                marginTop: '6px'
              }}
            >
              <ArrowLeft size={13} /> Back to PipWise Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated as Admin
  return children;
};

export default AdminRoute;
