import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context';
import {
  LayoutDashboard, Package, Play, ArrowDownLeft, ArrowUpRight,
  Users, Award, History, Settings, LogOut, Menu, X, User
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_4a166503-bc53-49ed-ab97-fc691e864fef/artifacts/2wqdbjxc_WhatsApp%20Image%202026-03-12%20at%204.43.20%20AM.jpeg";

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
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = isAdmin ? adminNavItems : userNavItems;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" data-testid="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
              <img src={LOGO_URL} alt="CLIPAY" className="h-10 w-auto" />
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            {!isAdmin && (
              <div className="mt-3 p-2 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Balance</p>
                <p className="text-lg font-bold text-slate-900">${user?.balance?.toFixed(2) || '0.00'}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            data-testid="mobile-menu-btn"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 md:flex-initial">
            <h1 className="text-lg font-semibold text-slate-900 md:hidden">
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {!isAdmin && user?.active_package && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                <Award className="w-3.5 h-3.5" />
                {user.active_package}
              </span>
            )}
            {isAdmin && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-medium">
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
