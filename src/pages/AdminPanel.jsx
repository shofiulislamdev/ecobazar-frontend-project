/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Sliders,
  ArrowLeft,
  Plus,
  Search,
  Edit3,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Package,
  X,
  Truck,
  CreditCard,
  Bell,
  Activity,
  Check,
  RefreshCw,
  UserCheck,
  UserX,
  Filter,
  BarChart3,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { PRESET_PRODUCTS } from '../data/products';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_SETTINGS,
} from '../data/adminMockData';

export const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  // Active Tab State: 'dashboard' | 'products' | 'users' | 'others'
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- Products State ---
  const [productsList, setProductsList] = useState(PRESET_PRODUCTS);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'electronics',
    price: '',
    discountPrice: '',
    stock: '',
    description: '',
    image: '',
  });

  // --- Users State ---
  const [usersList, setUsersList] = useState(INITIAL_ADMIN_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Customer',
  });

  // --- Orders State ---
  const [ordersList, setOrdersList] = useState(INITIAL_ADMIN_ORDERS);

  // --- Settings State ---
  const [settings, setSettings] = useState(INITIAL_ADMIN_SETTINGS);

  // -------------------------------------------------------------
  // Product Handlers
  // -------------------------------------------------------------
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.warn('Please fill in product name, price, and stock.');
      return;
    }

    const createdItem = {
      _id: 'p_' + Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      discountPrice: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : undefined,
      stock: parseInt(newProduct.stock, 10),
      description: newProduct.description || 'Premium curated catalog product.',
      images: [
        newProduct.image ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
      ],
      ratings: 5.0,
      numReviews: 1,
      createdAt: new Date().toISOString(),
    };

    setProductsList([createdItem, ...productsList]);
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      category: 'electronics',
      price: '',
      discountPrice: '',
      stock: '',
      description: '',
      image: '',
    });
    toast.success('New product added successfully!');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      setProductsList(productsList.filter((p) => p._id !== id));
      toast.info('Product removed.');
    }
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProductsList(
      productsList.map((p) =>
        p._id === editingProduct._id ? { ...p, ...editingProduct } : p
      )
    );
    setEditingProduct(null);
    toast.success('Product updated successfully!');
  };

  // -------------------------------------------------------------
  // User Handlers
  // -------------------------------------------------------------
  const handleToggleUserStatus = (id) => {
    setUsersList(
      usersList.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          toast.info(`User status changed to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleToggleUserRole = (id) => {
    setUsersList(
      usersList.map((u) => {
        if (u.id === id) {
          const nextRole = u.role === 'Admin' ? 'Customer' : 'Admin';
          toast.info(`${u.name} role changed to ${nextRole}`);
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      toast.warn('Please provide user name and email.');
      return;
    }

    const createdUser = {
      id: 'usr_' + Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      ordersCount: 0,
      totalSpent: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        newUser.name
      )}&background=6366f1&color=fff`,
    };

    setUsersList([createdUser, ...usersList]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'Customer' });
    toast.success('New user account added!');
  };

  // -------------------------------------------------------------
  // Filtered Products & Users
  // -------------------------------------------------------------
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      selectedProductCategory === 'all' ||
      p.category.toLowerCase() === selectedProductCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole =
      userRoleFilter === 'all' ||
      u.role.toLowerCase() === userRoleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div id="admin_panel_page" className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Back to Users Button & Admin Branding */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              id="back_to_users_btn"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Users</span>
            </Link>

            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                <Shield className="h-5 w-5" />
              </span>
              <span className="font-black text-lg tracking-tight">
                ECOBAZAR <span className="text-indigo-400 font-normal text-xs uppercase tracking-widest ml-1">Admin Panel</span>
              </span>
            </div>
          </div>

          {/* Right: Current Admin Info & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200">{user?.fullName || 'Admin User'}</span>
              <span className="text-[10px] text-indigo-400 font-mono">{user?.email || 'admin@ecobazar.com'}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-indigo-400">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <button
              id="admin_logout_btn"
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-all border border-red-500/50 cursor-pointer shadow-xs ml-1"
              title="Log Out from Admin Panel"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs Bar */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 sm:gap-2 py-2">
            
            {/* Dashboard Tab */}
            <button
              id="admin_tab_dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>1. Dashboard</span>
            </button>

            {/* Products Tab */}
            <button
              id="admin_tab_products"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>2. Products</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-900/80 text-indigo-200 border border-indigo-700">
                {productsList.length}
              </span>
            </button>

            {/* Users Tab */}
            <button
              id="admin_tab_users"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>3. Users</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {usersList.length}
              </span>
            </button>

            {/* Others Tab */}
            <button
              id="admin_tab_others"
              onClick={() => setActiveTab('others')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'others'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>4. Others</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-6">
        
        {/* ============================================================== */}
        {/* 1. DASHBOARD VIEW */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div id="admin_dashboard_section" className="space-y-6 animate-fadeIn">
            {/* Top Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Sales Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                    $42,850.00
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> +12.5% from last month
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Orders
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                    1,240
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> +8.2% new orders
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Package className="h-6 w-6" />
                </div>
              </div>

              {/* Users Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Active Customers
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                    {usersList.length * 142}
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> +15.4% new signups
                  </p>
                </div>
                <div className="p-3 bg-sky-50 dark:bg-sky-950/50 rounded-xl text-sky-600 dark:text-sky-400">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              {/* Inventory Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Catalog Items
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                    {productsList.length}
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> In stock & active
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Sales Chart Representation & Stats Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Growth Bar Visualizer */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Monthly Revenue Analytics
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Performance overview over the last 6 months
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1 rounded-full">
                    2025 - 2026
                  </span>
                </div>

                {/* Simulated Monthly Bars */}
                <div className="h-48 pt-6 flex items-end justify-between gap-2 sm:gap-4 px-2">
                  {[
                    { month: 'Jan', val: 45, rev: '$12,400' },
                    { month: 'Feb', val: 62, rev: '$18,200' },
                    { month: 'Mar', val: 55, rev: '$15,800' },
                    { month: 'Apr', val: 78, rev: '$24,100' },
                    { month: 'May', val: 88, rev: '$31,500' },
                    { month: 'Jun', val: 100, rev: '$42,850' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.rev}
                      </span>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg h-36 flex items-end p-1">
                        <div
                          style={{ height: `${bar.val}%` }}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 rounded-md transition-all duration-300"
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Platform Status */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  Store Health Monitor
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Server Latency</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">18 ms (Optimal)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Database Cluster</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Payment Gateways</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">4 Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">SSL Certificate</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Valid (256-bit)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Recent Customer Orders
                </h3>
                <span className="text-xs text-gray-500">Showing last 5 live orders</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-850 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items Purchased</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {ordersList.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {ord.id}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-gray-900 dark:text-white">{ord.customer}</p>
                          <p className="text-xs text-gray-500">{ord.email}</p>
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-300 text-xs max-w-xs truncate">
                          {ord.items}
                        </td>
                        <td className="p-3 font-bold text-gray-900 dark:text-white">
                          ${ord.total.toFixed(2)}
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {ord.paymentMethod}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : ord.status === 'Processing'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : ord.status === 'Shipped'
                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. PRODUCTS VIEW */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div id="admin_products_section" className="space-y-6 animate-fadeIn">
            {/* Header & Controls Bar */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    Product Inventory Management
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Manage stock levels, pricing, category taxonomy, and new entries.
                  </p>
                </div>

                <button
                  id="admin_add_product_btn"
                  onClick={() => setIsAddProductOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Search & Category Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="sm:col-span-2 relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="admin_product_search"
                    type="text"
                    placeholder="Search product by title or keyword..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <select
                    id="admin_product_category_filter"
                    value={selectedProductCategory}
                    onChange={(e) => setSelectedProductCategory(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs sm:text-sm bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="apparel">Apparel</option>
                    <option value="accessories">Accessories</option>
                    <option value="home">Home Decor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-850 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredProducts.map((prod) => (
                      <tr key={prod._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || 'https://via.placeholder.com/80'}
                            alt={prod.name}
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-800"
                          />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white max-w-xs truncate">{prod.name}</p>
                            <p className="text-xs text-gray-500 font-mono">ID: {prod._id}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-semibold capitalize">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white">
                          ${prod.price.toFixed(2)}
                          {prod.discountPrice && (
                            <span className="block text-xs text-emerald-600 dark:text-emerald-400 font-normal">
                              Sale: ${prod.discountPrice.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              prod.stock > 10
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : prod.stock > 0
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            }`}
                          >
                            {prod.stock > 0 ? `${prod.stock} units` : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                          ⭐ {prod.ratings || 5.0} ({prod.numReviews || 0})
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`edit_prod_${prod._id}`}
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              id={`delete_prod_${prod._id}`}
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Product Modal */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4 my-8">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Plus className="h-5 w-5 text-indigo-600" /> Add New Inventory Item
                    </h3>
                    <button
                      onClick={() => setIsAddProductOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddProduct} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. EcoBazar Wireless Earbuds"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                        >
                          <option value="electronics">Electronics</option>
                          <option value="apparel">Apparel</option>
                          <option value="accessories">Accessories</option>
                          <option value="home">Home Decor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 25"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Regular Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="e.g. 129.00"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Discount Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 99.00 (Optional)"
                          value={newProduct.discountPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        rows="3"
                        placeholder="Enter item specifications and highlights..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4 my-8">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Edit3 className="h-5 w-5 text-indigo-600" /> Edit Product Item
                    </h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                        >
                          <option value="electronics">Electronics</option>
                          <option value="apparel">Apparel</option>
                          <option value="accessories">Accessories</option>
                          <option value="home">Home Decor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) })}
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
                      >
                        Update Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. USERS VIEW */}
        {/* ============================================================== */}
        {activeTab === 'users' && (
          <div id="admin_users_section" className="space-y-6 animate-fadeIn">
            {/* Header & User Search */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    User Directory & Roles Management
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Manage accounts, roles (Admin / Customer), access privileges, and statuses.
                  </p>
                </div>

                <button
                  id="admin_add_user_btn"
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create User Account</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="sm:col-span-2 relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="admin_user_search"
                    type="text"
                    placeholder="Search user by name or email address..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <select
                    id="admin_user_role_filter"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs sm:text-sm bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-850 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">User Details</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Total Spent</th>
                      <th className="p-4 text-right">Account Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-10 w-10 rounded-full object-cover border border-indigo-200 dark:border-indigo-900"
                          />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              {u.name}
                              {u.role === 'Admin' && (
                                <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 inline" />
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              u.role === 'Admin'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : u.role === 'Manager'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                              u.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            }`}
                          >
                            {u.status === 'Active' ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                          {u.joinedDate}
                        </td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white">
                          ${u.totalSpent ? u.totalSpent.toFixed(2) : '0.00'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`toggle_role_${u.id}`}
                              onClick={() => handleToggleUserRole(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                              title="Toggle Role"
                            >
                              Toggle Role
                            </button>
                            <button
                              id={`toggle_status_${u.id}`}
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                u.status === 'Active'
                                  ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              }`}
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add User Modal */}
            {isAddUserOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Plus className="h-5 w-5 text-indigo-600" /> Create User Account
                    </h3>
                    <button
                      onClick={() => setIsAddUserOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddUser} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anisur Rahman"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="anisur@example.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assign Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setIsAddUserOpen(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. OTHERS VIEW (Settings, Configs, Notifications, Gateways) */}
        {/* ============================================================== */}
        {activeTab === 'others' && (
          <div id="admin_others_section" className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Other Platform Settings & Configurations
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Customize site banners, payment gateways, shipping rules, tax rates, and maintenance toggles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Announcement Banner Settings */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <Bell className="h-5 w-5 text-amber-500" /> Store Announcement Banner
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Banner Text Message
                    </label>
                    <input
                      type="text"
                      value={settings.announcement}
                      onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => toast.success('Announcement banner updated!')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Save Banner Message
                  </button>
                </div>
              </div>

              {/* Shipping & Tax Rates */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <Truck className="h-5 w-5 text-indigo-500" /> Shipping & Tax Rules
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Flat Shipping Fee ($)
                    </label>
                    <input
                      type="number"
                      value={settings.shippingFee}
                      onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Tax Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => toast.success('Shipping & Tax settings saved!')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  Save Rates
                </button>
              </div>

              {/* Payment Gateways Toggle */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <CreditCard className="h-5 w-5 text-emerald-500" /> Payment Methods Switcher
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  {[
                    { key: 'bkash', name: 'bKash Mobile Banking' },
                    { key: 'nagad', name: 'Nagad Mobile Banking' },
                    { key: 'stripe', name: 'Stripe Credit Cards' },
                    { key: 'cod', name: 'Cash on Delivery' },
                  ].map((gw) => (
                    <div key={gw.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-850">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{gw.name}</span>
                      <button
                        onClick={() => {
                          const nextState = !settings.paymentGateways[gw.key];
                          setSettings({
                            ...settings,
                            paymentGateways: {
                              ...settings.paymentGateways,
                              [gw.key]: nextState,
                            },
                          });
                          toast.info(`${gw.name} is now ${nextState ? 'Enabled' : 'Disabled'}`);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          settings.paymentGateways[gw.key]
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {settings.paymentGateways[gw.key] ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Maintenance & Mode Toggle */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> Maintenance Mode Controls
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enabling Maintenance Mode displays a temporary service upgrade banner to visitors while allowing admins full backend access.
                </p>

                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-300 text-sm">Maintenance Mode Status</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                      {settings.maintenanceMode ? 'ACTIVE - Site in upkeep' : 'OFF - Live for customers'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const nextVal = !settings.maintenanceMode;
                      setSettings({ ...settings, maintenanceMode: nextVal });
                      if (nextVal) {
                        toast.warn('Maintenance mode activated');
                      } else {
                        toast.success('Maintenance mode deactivated');
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      settings.maintenanceMode
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    {settings.maintenanceMode ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
