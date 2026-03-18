import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context';
import {
  LayoutDashboard, Package, Play, ArrowDownLeft, ArrowUpRight,
  Users, Award, History, Settings, LogOut, Menu, X, User, ChevronRight, Sparkles, Eye, ArrowLeft
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_e1272004-e80f-434e-aadb-e8d8dc2b88c2/artifacts/zq3sywj3_Untitled_design__1_-removebg-preview.png";

const userNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/packages', label: 'Packages', icon: Package },
  { path: '/watch', label: 'Watch & Earn', icon: Play },
  { path: '/deposit', label: 'Deposit', icon: ArrowDownLeft },
  { path: '/withdraw', label: 'Withdraw', icon: ArrowUpRight },
  { path: '/referrals', label: 'Referrals', icon: Users },
  { path: '/ranks', label: 'Ranks', icon: Award },
  { path: '/history', label: 'History', icon: History },
  { path: '/profile', label: 'Profile', icon: User },
];

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/deposits', label: 'Deposits', icon: ArrowDownLeft },
  { path: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
  { path: '/admin/packages', label: 'Packages', icon: Package },
  { path: '/admin/links', label: 'Links', icon: Play },
  { path: '/admin/mlm', label: 'MLM Settings', icon: Users },
  { path: '/admin/ranks', label: 'Ranks', icon: Award },
  { path: '/admin/transactions', label: 'Transactions', icon: History },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const DashboardLayout = ({ children, isAdmin = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const { user, logout, setUser, setToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = isAdmin ? adminNavItems : userNavItems;

  useEffect(() => {
    const impersonating = localStorage.getItem('clipay_impersonating') === 'true';
    setIsImpersonating(impersonating);
  }, []);

  const handleReturnToAdmin = () => {
    // Restore admin session
    const adminToken = localStorage.getItem('clipay_admin_backup_token');
    const adminUser = localStorage.getItem('clipay_admin_backup_user');
    
    if (adminToken && adminUser) {
      localStorage.setItem('clipay_token', adminToken);
      localStorage.setItem('clipay_user', adminUser);
      localStorage.removeItem('clipay_admin_backup_token');
      localStorage.removeItem('clipay_admin_backup_user');
      localStorage.removeItem('clipay_impersonating');
      
      // Update auth context
      setToken(adminToken);
      setUser(JSON.parse(adminUser));
      
      // Close window if opened in new tab, otherwise navigate
      if (window.opener) {
        window.close();
      } else {
        navigate('/admin/users');
        window.location.reload();
      }
    }
  };
  
  const handleLogout = () => {
    // Clear impersonation data if present
    localStorage.removeItem('clipay_admin_backup_token');
    localStorage.removeItem('clipay_admin_backup_user');
    localStorage.removeItem('clipay_impersonating');
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex relative" data-testid="dashboard-layout">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 grid-bg opacity-10"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 h-screen inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full glass border-r border-white/5 flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-3">
              <img src={LOGO_URL} alt="CLIPAY" className="h-10 w-auto" />
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 mb-4">
            <div className="glass-light rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              {!isAdmin && (
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-slate-400">Balance</span>
                  <span className="text-lg font-bold text-white">${user?.balance?.toFixed(2) || '0.00'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white border-l-2 border-blue-500' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
                      {item.label}
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Impersonation Banner */}
        {isImpersonating && !isAdmin && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-3 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">Admin View Mode</span>
              <span className="text-black/70">- Viewing {user?.name}'s dashboard</span>
            </div>
            <button
              onClick={handleReturnToAdmin}
              className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Admin Panel
            </button>
          </div>
        )}

        {/* Top Header */}
        <header className="glass border-b border-white/5 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
              data-testid="mobile-menu-btn"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-white">
                {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="md:hidden">
              <h1 className="text-lg font-semibold text-white">
                {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isAdmin && user?.active_package && (
              <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                {user.active_package}
              </span>
            )}
            {isAdmin && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
                Admin Panel
              </span>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
