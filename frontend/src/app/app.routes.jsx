import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home.jsx';
import AdminRoute from '../features/auth/components/AdminRoute.jsx';

const AllBrokers = lazy(() => import('../pages/AllBrokers.jsx'));
const CompareBrokers = lazy(() => import('../pages/CompareBrokers.jsx'));
const JoinBroker = lazy(() => import('../pages/JoinBroker.jsx'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'));

export const AppRoutes = React.memo(({ theme, heroComplete, setHeroComplete, onHeroFinished }) => {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} aria-busy="true" />}>
      <Routes>
        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/admin" replace />}
        />
        <Route
          path="/"
          element={
            <Home
              theme={theme}
              heroComplete={heroComplete}
              onTitleComplete={onHeroFinished || (() => setHeroComplete(true))}
            />
          }
        />
        <Route
          path="/brokers"
          element={<AllBrokers theme={theme} />}
        />
        <Route
          path="/all-brokers"
          element={<Navigate to="/brokers" replace />}
        />
        <Route
          path="/compare"
          element={<CompareBrokers theme={theme} />}
        />
        <Route
          path="/compare-brokers"
          element={<Navigate to="/compare" replace />}
        />
        <Route
          path="/comparisons"
          element={<Navigate to="/compare" replace />}
        />
        <Route
          path="/join-broker"
          element={<JoinBroker theme={theme} />}
        />
        <Route
          path="/add-broker"
          element={<Navigate to="/join-broker" replace />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy theme={theme} />}
        />
        <Route
          path="/privacy"
          element={<Navigate to="/privacy-policy" replace />}
        />
        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
});

export default AppRoutes;

