import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clipay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('clipay_token');
      localStorage.removeItem('clipay_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('clipay_token');
    const savedUser = localStorage.getItem('clipay_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Refresh user data
      api.get('/auth/me').then(res => {
        setUser(res.data);
        localStorage.setItem('clipay_user', JSON.stringify(res.data));
      }).catch(() => {
        logout();
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('clipay_token', res.data.token);
    localStorage.setItem('clipay_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (name, email, password, referralCode, mobile) => {
    const res = await api.post('/auth/signup', { 
      name, 
      email, 
      password, 
      referral_code: referralCode,
      mobile
    });
    localStorage.setItem('clipay_token', res.data.token);
    localStorage.setItem('clipay_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('clipay_token');
    localStorage.removeItem('clipay_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('clipay_user', JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

// Toast Context
const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`toast-enter px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 min-w-[280px] ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          toast.type === 'warning' ? 'bg-amber-500 text-white' :
          'bg-blue-500 text-white'
        }`}
      >
        {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
        {toast.type === 'error' && <XCircle className="w-5 h-5" />}
        {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
        {toast.type === 'info' && <Info className="w-5 h-5" />}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    ))}
  </div>
);

// Icons
import { 
  CheckCircle, XCircle, AlertTriangle, Info, 
  Wallet, DollarSign, Users, ArrowUpRight, ArrowDownLeft,
  Play, Package, CreditCard, History, Award, Settings,
  Menu, X, LogOut, User, Home, Link2, LayoutDashboard,
  ChevronRight, Copy, Eye, EyeOff, Loader2, Plus, Trash2,
  Edit, Search, Filter, RefreshCw, ExternalLink, Star,
  TrendingUp, Clock, Globe, Youtube, Instagram, Facebook
} from 'lucide-react';

export { 
  api, 
  CheckCircle, XCircle, AlertTriangle, Info,
  Wallet, DollarSign, Users, ArrowUpRight, ArrowDownLeft,
  Play, Package, CreditCard, History, Award, Settings,
  Menu, X, LogOut, User, Home, Link2, LayoutDashboard,
  ChevronRight, Copy, Eye, EyeOff, Loader2, Plus, Trash2,
  Edit, Search, Filter, RefreshCw, ExternalLink, Star,
  TrendingUp, Clock, Globe, Youtube, Instagram, Facebook
};
