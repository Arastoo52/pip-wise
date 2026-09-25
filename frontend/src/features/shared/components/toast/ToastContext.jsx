import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const dismissToast = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 3600 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const updateToast = useCallback(
    (id, { type, title, message, duration = 3600 }) => {
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }

      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, type, title, message } : t))
      );

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = useCallback(
    (title, message, duration) =>
      showToast({ type: 'success', title, message, duration }),
    [showToast]
  );

  const error = useCallback(
    (title, message, duration) =>
      showToast({ type: 'error', title, message, duration }),
    [showToast]
  );

  const info = useCallback(
    (title, message, duration) =>
      showToast({ type: 'info', title, message, duration }),
    [showToast]
  );

  const loading = useCallback(
    (title, message) =>
      showToast({ type: 'loading', title, message, duration: 0 }),
    [showToast]
  );

  const toastMethods = {
    showToast,
    dismiss: dismissToast,
    update: updateToast,
    success,
    error,
    info,
    loading,
  };

  return (
    <ToastContext.Provider value={{ toasts, toast: toastMethods, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};

export const useToastList = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastList must be used within a ToastProvider');
  }
  return { toasts: context.toasts, dismissToast: context.dismissToast };
};

export default ToastContext;
