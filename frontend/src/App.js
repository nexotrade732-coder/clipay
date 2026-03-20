import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ToastProvider, useAuth } from "@/lib/context";

// Pages
import LandingPage from "@/pages/Landing";
import AuthPage from "@/pages/Auth";
import UserDashboard from "@/pages/user/Dashboard";
import UserPackages from "@/pages/user/Packages";
import UserWatch from "@/pages/user/Watch";
import UserDeposit from "@/pages/user/Deposit";
import UserWithdraw from "@/pages/user/Withdraw";
import UserReferrals from "@/pages/user/Referrals";
import UserRanks from "@/pages/user/Ranks";
import UserHistory from "@/pages/user/History";
import UserProfile from "@/pages/user/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminDeposits from "@/pages/admin/Deposits";
import AdminWithdrawals from "@/pages/admin/Withdrawals";
import AdminPackages from "@/pages/admin/Packages";
import AdminLinks from "@/pages/admin/Links";
import AdminMLM from "@/pages/admin/MLM";
import AdminRanks from "@/pages/admin/Ranks";
import AdminSettings from "@/pages/admin/Settings";
import AdminTransactions from "@/pages/admin/Transactions";

// Layout
import DashboardLayout from "@/components/DashboardLayout";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
            <Route path="/signup/:referralCode" element={<PublicRoute><AuthPage /></PublicRoute>} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/packages" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserPackages />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/watch" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserWatch />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/deposit" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserDeposit />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/withdraw" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserWithdraw />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/referrals" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserReferrals />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/ranks" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserRanks />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserHistory />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserProfile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminUsers />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/deposits" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminDeposits />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/withdrawals" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminWithdrawals />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/packages" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminPackages />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/links" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminLinks />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/mlm" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminMLM />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/ranks" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminRanks />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminSettings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/transactions" element={
              <ProtectedRoute adminOnly>
                <DashboardLayout isAdmin>
                  <AdminTransactions />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Floating Social Buttons - visible on all pages */}
          <FloatingSocialButtons />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
