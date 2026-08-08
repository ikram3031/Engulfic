'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import {  useNavigate  } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import SearchModal from '@/components/SearchModal';
import { useAuthStore } from '@/store/useAuthStore';
import {
  User,
  ShoppingCart,
  Edit3,
  Save,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  X,
  ChevronRight,
  ShieldCheck,
  Tag,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function ProfilePage() {
  const router = useNavigate();
  const { isLoggedIn, user, orders, updateProfile, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders'
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedQuickView, setSelectedQuickView] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For order detail drawer
  const [toastMessage, setToastMessage] = useState('');

  // Editable Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Ikramul Hossen',
    email: user?.email || 'ikramul.hossen3031@gmail.com',
    phone: user?.phone || '+880 1712-345678',
    address: user?.address || 'House 42, Road 11, Block D, Banani',
    city: user?.city || 'Dhaka',
    zipCode: user?.zipCode || '1213'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    showToast('Profile updated successfully!');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans">
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 text-center shadow-xl space-y-4">
            <div className="p-4 bg-orange-500/10 text-orange-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-orange-500/20">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Account Required</h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Please sign in to access your member dashboard, track active orders, and view exclusive VIP discount privileges.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg"
            >
              Back To Shop
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3 rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-800 flex items-center gap-3 animate-slideIn">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-mono font-bold">{toastMessage}</span>
        </div>
      )}

      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-zinc-800 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-mono mb-1">
              <Link to="/" className="hover:text-orange-500 transition">Home</Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-bold">Account Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Member Dashboard
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl">
            <Tag className="w-4 h-4 text-orange-500" />
            <div className="text-left text-xs font-mono">
              <span className="text-slate-500 dark:text-zinc-400 block text-[10px]">Active Promo</span>
              <span className="font-bold text-orange-500">{user?.discountCode || 'ENGULF5'} (5% Extra)</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout (Compact Desktop View) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Vertical Sidebar Tabs */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900/90 rounded-3xl p-4 border border-slate-200 dark:border-zinc-800/80 shadow-sm space-y-2 backdrop-blur-md">
            {/* User Badge Summary */}
            <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name}</h3>
                  <span className="inline-block px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono rounded border border-orange-500/20">
                    {user?.tier}
                  </span>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'profile'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'orders'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order History</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                }`}>
                  {orders.length}
                </span>
              </button>
            </nav>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 bg-white dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800/80 shadow-sm min-h-[500px]">
            {/* TAB 1: PROFILE VIEW & EDIT */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800 gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                      Profile Information
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                      Manage your personal credentials, contact info, and shipping address.
                    </p>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                    >
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  /* Read-only View */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">Full Name</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{user?.name || 'Ikramul Hossen'}</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">Email Address</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white font-mono">{user?.email}</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">Phone Number</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white font-mono">{user?.phone}</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">Membership Tier</span>
                      <p className="font-bold text-sm text-orange-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        {user?.tier}
                      </p>
                    </div>

                    <div className="md:col-span-2 p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">Default Shipping Address</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {user?.address}, {user?.city} - {user?.zipCode}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Editable Form View */
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 dark:text-zinc-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-sans font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-500 dark:text-zinc-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-500 dark:text-zinc-400 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-500 dark:text-zinc-400 mb-1">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-sans"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-mono text-slate-500 dark:text-zinc-400 mb-1">Street Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-sans"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
                  <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                    Order History
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                    View placed orders, track shipment progress, and check item details.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto" />
                    <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No orders placed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-orange-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                              {order.id}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 font-mono">
                            <span>Date: {order.date}</span>
                            <span>•</span>
                            <span>Items: {order.items.length}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-900 dark:text-white">Total: ${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>View Order Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CUSTOM DRAWER: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md flex justify-end animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white dark:bg-zinc-950 h-full shadow-2xl border-l border-slate-200 dark:border-zinc-800 flex flex-col justify-between overflow-y-auto animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md z-10">
              <div>
                <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest block font-bold">
                  Order Summary
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  {selectedOrder.id}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Order Status Bar */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">Status</span>
                  <span className="text-xs font-mono font-bold text-emerald-500">{selectedOrder.status}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: selectedOrder.status === 'Delivered' ? '100%' : '65%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500 pt-1">
                  <span>Placed</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono">
                  Purchased Garments ({selectedOrder.items.length})
                </h4>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-xl border border-slate-200/60 dark:border-zinc-800/60"
                    >
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-zinc-800">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h5>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                          {item.color} • Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-mono font-bold text-orange-500 mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Details */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase">Shipping Address</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{selectedOrder.shippingAddress}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between">
                  <span className="text-slate-400 dark:text-zinc-500">Payment Method:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedOrder.paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-zinc-500">Tracking Number:</span>
                  <span className="font-bold text-orange-500">{selectedOrder.trackingNumber}</span>
                </div>
              </div>

              {/* Total Price Summary */}
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-slate-900 dark:text-white uppercase">Grand Total Paid:</span>
                <span className="text-base font-black text-orange-500">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-zinc-800 sticky bottom-0 bg-white dark:bg-zinc-950">
              <button
                onClick={() => {
                  showToast(`Invoice for ${selectedOrder.id} downloaded.`);
                }}
                className="w-full py-3 bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition shadow-lg"
              >
                Download Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onQuickView={(product) => setSelectedQuickView(product)}
      />

      {/* Quick View Modal */}
      {selectedQuickView && (
        <QuickViewModal
          product={selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
        />
      )}

      <CartDrawer />
      <Footer />
    </div>
  );
}
