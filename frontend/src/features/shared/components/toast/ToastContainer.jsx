import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Loader2, X } from 'lucide-react';
import { useToastList } from './ToastContext.jsx';
import './Toast.css';

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 size={17} className="pipwise-toast-icon icon-success" />;
    case 'error':
      return <AlertCircle size={17} className="pipwise-toast-icon icon-error" />;
    case 'loading':
      return <Loader2 size={17} className="pipwise-toast-icon icon-loading pipwise-toast-spin" />;
    case 'info':
    default:
      return <Info size={17} className="pipwise-toast-icon icon-info" />;
  }
};

export const ToastContainer = () => {
  const { toasts, dismissToast } = useToastList();

  return (
    <div className="pipwise-toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`pipwise-toast-card toast-${toast.type}`}
          >
            <div className="pipwise-toast-icon-wrap">
              {getToastIcon(toast.type)}
            </div>

            <div className="pipwise-toast-body">
              {toast.title && <div className="pipwise-toast-title">{toast.title}</div>}
              {toast.message && <div className="pipwise-toast-message">{toast.message}</div>}
            </div>

            {toast.type !== 'loading' && (
              <button
                type="button"
                className="pipwise-toast-close-btn"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
