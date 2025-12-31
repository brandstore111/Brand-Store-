
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ServiceForm from './pages/ServiceForm';
import AdminDashboard from './pages/AdminDashboard';
import MerchantDashboard from './pages/MerchantDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/" />;
  if (roles && !roles.includes(user.type)) return <Navigate to="/dashboard" />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* المدخل الأساسي للموقع */}
          <Route path="/" element={<Landing />} />
          
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          <Route path="/marketplace" element={
            <ProtectedRoute><Marketplace /></ProtectedRoute>
          } />

          <Route path="/service/:serviceId" element={
            <ProtectedRoute><ServiceForm /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="/merchant" element={
            <ProtectedRoute roles={['MERCHANT', 'ADMIN']}><MerchantDashboard /></ProtectedRoute>
          } />

          <Route path="/wallet" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* إعادة التوجيه للرئيسية في حال عدم وجود المسار */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
