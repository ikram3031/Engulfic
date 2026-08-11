'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  useNavigate  } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatPrice } from '@/lib/utils';
import { createOrder } from '@/core/lib/api';
import {
  ShoppingCart,
  ShieldCheck,
  Tag,
  ArrowRight,
  CheckCircle2,
  Lock,
  User,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Truck,
  Download,
  Printer,
  FileText,
  Building2
} from 'lucide-react';

const BANGLADESH_DISTRICTS = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogra', 'Brahmanbaria',
  'Chandpur', 'Chapai Nawabganj', 'Chattogram', 'Chuadanga', "Cox's Bazar", 'Cumilla',
  'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj',
  'Habiganj', 'Jamalpur', 'Jashore', 'Jhalokati', 'Jhenaidah', 'Joypurhat',
  'Khagrachhari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur',
  'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar',
  'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi',
  'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh',
  'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur',
  'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet',
  'Tangail', 'Thakurgaon'
];

export default function CheckoutPage() {
  const router = useNavigate();
  const { cart, getSubtotal, getDiscountAmount, promoCode, applyPromoCode, removePromoCode, clearCart } = useCartStore();
  const { isLoggedIn, user, login, logout, updateProfile } = useAuthStore();

  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Checkout Form, 2: Order Complete / Invoice
  const [orderId, setOrderId] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);

  // Auth toggle tab
  const [authTab, setAuthTab] = useState('signin'); // 'signin' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  // Promo code input
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  // Billing address form with prefilled dummy information for easy testing
  const [billingForm, setBillingForm] = useState({
    firstName: 'Ahsan',
    lastName: 'Rahman',
    email: 'ahsan.rahman@engulfic.com',
    phone: '01712345678',
    address: 'House 42, Road 11, Block D, Banani',
    town: 'Dhaka',
    district: 'Dhaka',
    thana: 'Mohammadpur'
  });

  // Shipping address form (different address)
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    firstName: 'Ahsan',
    lastName: 'Rahman',
    email: 'ahsan.rahman@engulfic.com',
    phone: '01712345678',
    address: 'House 42, Road 11, Block D, Banani',
    town: 'Dhaka',
    district: 'Dhaka',
    thana: 'Mohammadpur'
  });

  // Pre-fill fields if user is logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      const timer = setTimeout(() => {
        setBillingForm((prev) => ({
          ...prev,
          firstName: nameParts[0] || 'Ahsan',
          lastName: nameParts.slice(1).join(' ') || 'Rahman',
          email: user.email || 'ahsan.rahman@engulfic.com',
          phone: user.phone || '01712345678',
          address: user.address || 'House 42, Road 11, Block D, Banani',
          town: user.city || 'Dhaka',
          district: 'Dhaka'
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user]);

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Auth Submit handlers
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!authEmail) {
      setToastMessage('Email is required');
      return;
    }
    const loggedInUser = login(authEmail);
    setToastMessage(`Signed in as ${loggedInUser.name}`);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!authEmail || !authFirstName || !authLastName || !authPhone) {
      setToastMessage('Please fill all required sign up fields');
      return;
    }
    const loggedInUser = login(authEmail);
    const fullName = `${authFirstName} ${authLastName}`;
    updateProfile({
      name: fullName,
      phone: authPhone,
      email: authEmail
    });
    setToastMessage(`Account created successfully! Signed in as ${fullName}`);
  };

  // Shipping calculation
  const getCalculatedShipping = () => {
    if (cart.length === 0) return { cost: 0, label: 'Delivery Charge' };

    const activeDistrict = shipToDifferent ? shippingForm.district : billingForm.district;
    const activeThana = shipToDifferent ? shippingForm.thana : billingForm.thana;

    if (!activeDistrict) {
      return { cost: 0, label: 'Delivery Charge' };
    }

    if (activeDistrict.toLowerCase() === 'dhaka') {
      if (activeThana === 'Savar') {
        return { cost: 100, label: 'Delivery Charge (Dhaka Suburbs)' };
      } else {
        // Mohammadpur Thana or default Dhaka inside
        return { cost: 70, label: 'Delivery Charge (Inside Dhaka)' };
      }
    } else {
      return { cost: 120, label: 'Delivery Charge (Outside Dhaka)' };
    }
  };

  const shippingInfo = getCalculatedShipping();
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shippingCost = shippingInfo.cost;
  const grandTotal = Math.max(0, subtotal - discount + shippingCost);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage(res);
    if (res.success) {
      setToastMessage(res.message);
      setPromoInput('');
    }
  };

  // Final Order Submit handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Verify billing address fields
    if (!billingForm.firstName || !billingForm.lastName || !billingForm.email || !billingForm.phone || !billingForm.address || !billingForm.town || !billingForm.district) {
      setToastMessage('Please fill in all mandatory billing fields.');
      return;
    }

    // Verify shipping address fields if shipping to different address is checked
    if (shipToDifferent) {
      if (!shippingForm.firstName || !shippingForm.lastName || !shippingForm.email || !shippingForm.phone || !shippingForm.address || !shippingForm.town || !shippingForm.district) {
        setToastMessage('Please fill in all mandatory shipping fields.');
        return;
      }
    }

    try {
      // Build order payload for backend Order API submission
      const orderPayload = {
        items: cart.map(item => ({
          product: item.id || item._id,
          name: item.name,
          size: item.selectedSize || 'Standard',
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: shipToDifferent ? shippingForm : billingForm,
        billingAddress: billingForm,
        subtotal,
        shippingFee: shippingCost,
        discount,
        promoCode,
        totalAmount: grandTotal,
        paymentMethod: 'COD' // Cash on Delivery
      };

      const response = await createOrder(orderPayload);
      const generatedId = response.data?.orderId || response.orderId || `ENG-${Math.floor(100000 + Math.random() * 900000)}`;

      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const summaryData = {
        orderId: generatedId,
        date: formattedDate,
        items: [...cart],
        billing: { ...billingForm },
        shipping: shipToDifferent ? { ...shippingForm } : { ...billingForm },
        shippingInfo: { ...shippingInfo },
        subtotal,
        discount,
        promoCode,
        shippingCost,
        grandTotal
      };

      setOrderId(generatedId);
      setOrderSummary(summaryData);
      setStep(2);
      clearCart();
    } catch (err) {
      setToastMessage(err.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        <Breadcrumb items={[{ label: 'Shopping Cart', href: '/cart' }, { label: 'Checkout' }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200 dark:border-white/10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-500 mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>SECURE CHECKOUT TERMINAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Checkout
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {step === 1 ? (
            cart.length === 0 ? (
              <div className="text-center py-20 px-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl mx-auto space-y-6">
                <div className="inline-flex p-5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-wide">YOUR CART IS EMPTY</h2>
                  <p className="text-xs font-mono text-slate-500 dark:text-white/60 max-w-md mx-auto">
                    Please add items to your cart before proceeding to the checkout page.
                  </p>
                </div>
                <Link to="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-orange-600 transition shadow-xl"
                >
                  <span>CONTINUE SHOPPING</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Forms */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Step 1: User Authentication check */}
                  <div className="p-6 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-full text-orange-500 border border-orange-500/20">
                        <User className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-wide">1. Customer Account</h3>
                    </div>

                    {isLoggedIn && user ? (
                      <div className="p-4 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
                        <div>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">REGISTERED CUSTOMER SIGNED IN</p>
                          <p className="text-slate-700 dark:text-white/80 mt-1">
                            Hello, <strong className="text-slate-900 dark:text-white">{user.name}</strong> ({user.email})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={logout}
                          className="px-4 py-2 bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white text-[11px] font-bold uppercase rounded-xl transition"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex border-b border-slate-200 dark:border-white/10">
                          <button
                            type="button"
                            onClick={() => setAuthTab('signin')}
                            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition ${
                              authTab === 'signin' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-slate-500 dark:text-white/40'
                            }`}
                          >
                            Sign In (Registered)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAuthTab('signup')}
                            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition ${
                              authTab === 'signup' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-slate-500 dark:text-white/40'
                            }`}
                          >
                            Sign Up (New User)
                          </button>
                        </div>

                        {authTab === 'signin' ? (
                          <form onSubmit={handleSignInSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Email Address</label>
                              <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Password</label>
                              <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="submit"
                                className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition"
                              >
                                Sign In
                              </button>
                            </div>
                          </form>
                        ) : (
                          <form onSubmit={handleSignUpSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">First Name *</label>
                              <input
                                type="text"
                                required
                                value={authFirstName}
                                onChange={(e) => setAuthFirstName(e.target.value)}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Last Name *</label>
                              <input
                                type="text"
                                required
                                value={authLastName}
                                onChange={(e) => setAuthLastName(e.target.value)}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Email Address *</label>
                              <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Phone Number *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. +880 17XXXXXXXX"
                                value={authPhone}
                                onChange={(e) => setAuthPhone(e.target.value)}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div className="sm:col-span-2 flex justify-end pt-2">
                              <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition"
                              >
                                Sign Up & Create Account
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Billing & Shipping Information */}
                  <form onSubmit={handlePlaceOrder} className="space-y-8">
                    {/* Billing Address Card */}
                    <div className="p-6 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-full text-orange-500 border border-orange-500/20">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wide">2. Billing Address</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">First Name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={billingForm.firstName}
                            onChange={handleBillingChange}
                            required
                            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={billingForm.lastName}
                            onChange={handleBillingChange}
                            required
                            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            value={billingForm.email}
                            onChange={handleBillingChange}
                            required
                            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Phone Number *</label>
                          <input
                            type="text"
                            name="phone"
                            value={billingForm.phone}
                            onChange={handleBillingChange}
                            required
                            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Street Address *</label>
                          <input
                            type="text"
                            name="address"
                            value={billingForm.address}
                            onChange={handleBillingChange}
                            required
                            placeholder="House No, Road No, Apartment, Block"
                            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Town / City *</label>
                          <input
                            type="text"
                            name="town"
                            value={billingForm.town}
                            onChange={handleBillingChange}
                            required
                            placeholder="e.g. Banani"
                            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">District *</label>
                          <select
                            name="district"
                            value={billingForm.district}
                            onChange={handleBillingChange}
                            required
                            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                          >
                            {BANGLADESH_DISTRICTS.map((dist) => (
                              <option key={dist} value={dist} className="text-slate-900 dark:text-white bg-white dark:bg-zinc-950">
                                {dist}
                              </option>
                            ))}
                          </select>
                        </div>

                        {billingForm.district.toLowerCase() === 'dhaka' && (
                          <div className="animate-fadeIn">
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Thana *</label>
                            <select
                              name="thana"
                              value={billingForm.thana}
                              onChange={handleBillingChange}
                              required
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            >
                              <option value="Mohammadpur" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Mohammadpur (Inside Dhaka - 70 Taka)</option>
                              <option value="Savar" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Savar (Dhaka Suburbs - 100 Taka)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ship to Different Address Checkbox */}
                    <div className="p-4 bg-slate-100/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shipToDifferent}
                          onChange={(e) => setShipToDifferent(e.target.checked)}
                          className="w-4 h-4 text-orange-500 rounded border-slate-300 dark:border-white/10 bg-transparent focus:ring-orange-500"
                        />
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-white/90">Shipping to a different address</span>
                      </label>
                    </div>

                    {/* Shipping Address Card (Only if checked) */}
                    {shipToDifferent && (
                      <div className="p-6 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-6 animate-fadeIn">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-500/10 rounded-full text-orange-500 border border-orange-500/20">
                            <Truck className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-wide">Shipping Destination</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">First Name *</label>
                            <input
                              type="text"
                              name="firstName"
                              value={shippingForm.firstName}
                              onChange={handleShippingChange}
                              required={shipToDifferent}
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Last Name *</label>
                            <input
                              type="text"
                              name="lastName"
                              value={shippingForm.lastName}
                              onChange={handleShippingChange}
                              required={shipToDifferent}
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              value={shippingForm.email}
                              onChange={handleShippingChange}
                              required={shipToDifferent}
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Phone Number *</label>
                            <input
                              type="text"
                              name="phone"
                              value={shippingForm.phone}
                              onChange={handleShippingChange}
                              required={shipToDifferent}
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Street Address *</label>
                            <input
                              type="text"
                              name="address"
                              value={shippingForm.address}
                              onChange={handleShippingChange}
                              required={shipToDifferent}
                              placeholder="House No, Road No, Apartment, Block"
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Town / City *</label>
                            <input
                              type="text"
                              name="town"
                              value={shippingForm.town}
                              onChange={handleShippingChange}
                              required={shipToDifferent}
                              placeholder="e.g. Uttara"
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">District *</label>
                            <select
                              name="district"
                              value={shippingForm.district}
                              onChange={handleShippingChange}
                              required={shipToDifferent}
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            >
                              {BANGLADESH_DISTRICTS.map((dist) => (
                                <option key={dist} value={dist} className="text-slate-900 dark:text-white bg-white dark:bg-zinc-950">
                                  {dist}
                                </option>
                              ))}
                            </select>
                          </div>

                          {shippingForm.district.toLowerCase() === 'dhaka' && (
                            <div className="animate-fadeIn">
                              <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Thana *</label>
                              <select
                                name="thana"
                                value={shippingForm.thana}
                                onChange={handleShippingChange}
                                required={shipToDifferent}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              >
                                <option value="Mohammadpur" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Mohammadpur (Inside Dhaka - 70 Taka)</option>
                                <option value="Savar" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Savar (Dhaka Suburbs - 100 Taka)</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment Method (Cash on delivery is the only option available) */}
                    <div className="p-6 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-full text-orange-500 border border-orange-500/20">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wide">3. Payment Option</h3>
                      </div>

                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                        <div className="text-xs font-mono">
                          <span className="block font-bold uppercase text-orange-600 dark:text-orange-400">Cash on Delivery (COD)</span>
                          <span className="text-slate-600 dark:text-white/70">Pay in cash directly to the delivery courier when your order arrives at your destination. This is our only payment option available.</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Action CTA */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-orange-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-600 transition shadow-2xl border border-orange-400/30 flex items-center justify-center gap-2"
                    >
                      <span>Complete Checkout ({formatPrice(grandTotal)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Right Side: Order Summary & Delivery calculation */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-6 shadow-xl">
                    <h3 className="text-lg font-black uppercase tracking-wide border-b border-slate-200 dark:border-white/10 pb-4">
                      Your Order
                    </h3>

                    {/* Mini Cart Item List */}
                    <div className="max-h-[30vh] overflow-y-auto space-y-3">
                      {cart.map((item) => (
                        <div key={item.cartItemId} className="flex gap-3 items-center text-xs font-mono">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-16 object-cover rounded-lg bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate uppercase">{item.name}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-white/50 mt-0.5">
                              Size: {item.selectedSize} | Color: {item.selectedColor}
                            </p>
                            <p className="text-[10px] text-orange-500 mt-0.5 font-bold">
                              Qty: {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <span className="font-black font-mono text-slate-900 dark:text-white shrink-0">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Integration */}
                    <form onSubmit={handleApplyPromo} className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/10">
                      <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase">Promo Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="e.g. ENGULF20"
                          className="flex-1 bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 dark:bg-white/10 hover:bg-orange-500 text-white font-bold text-xs uppercase rounded-xl transition"
                        >
                          Apply
                        </button>
                      </div>
                      {promoCode && (
                        <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-mono pt-1">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            Code {promoCode} Applied
                          </span>
                          <button
                            type="button"
                            onClick={removePromoCode}
                            className="text-red-500 underline text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {promoMessage && (
                        <p className={`text-[10px] font-mono ${promoMessage.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {promoMessage.message}
                        </p>
                      )}
                    </form>

                    {/* Calculations breakdown */}
                    <div className="space-y-3 font-mono text-xs border-t border-slate-200 dark:border-white/10 pt-4">
                      <div className="flex justify-between text-slate-600 dark:text-white/70">
                        <span>Subtotal</span>
                        <span className="text-slate-900 dark:text-white font-bold">{formatPrice(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>Discount ({promoCode})</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}

                      {/* Delivery Charge Detail structure (Left: information description, Right: charge amounts) */}
                      <div className="flex justify-between items-start text-slate-600 dark:text-white/70 border-b border-slate-200 dark:border-white/10 pb-3">
                        <div className="space-y-0.5">
                          <span className="block font-bold text-slate-800 dark:text-white">{shippingInfo.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-white/40 block leading-tight">
                            {shipToDifferent 
                              ? `Based on shipping to ${shippingForm.district}${shippingForm.district.toLowerCase() === 'dhaka' ? ` (${shippingForm.thana})` : ''}`
                              : `Based on billing to ${billingForm.district}${billingForm.district.toLowerCase() === 'dhaka' ? ` (${billingForm.thana})` : ''}`
                            }
                          </span>
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold shrink-0">
                          {formatPrice(shippingCost)}
                        </span>
                      </div>

                      <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2">
                        <span>TOTAL TO PAY</span>
                        <span className="text-orange-500 font-bold text-lg">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 dark:text-white/50 pt-2 border-t border-slate-200 dark:border-white/10">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>256-Bit Secure SSL Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Order Confirmed & Printable Invoice View (Step 2) */
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              {/* Header Banner & Print/Download Controls */}
              <div className="p-6 sm:p-8 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl text-center space-y-6 shadow-2xl no-print">
                <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <span className="px-3.5 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-300 text-xs font-mono font-bold rounded-full border border-orange-500/30 uppercase tracking-widest">
                    ORDER CONFIRMED & INVOICE GENERATED
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Thank You For Your Order!</h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-lg mx-auto font-mono">
                    Order <strong className="text-orange-500 font-bold">{orderId}</strong> has been logged. An official tax invoice has been generated below.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 text-white font-black uppercase tracking-wider text-xs rounded-2xl hover:bg-orange-600 transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>DOWNLOAD / PRINT INVOICE (PDF)</span>
                  </button>

                  <Link to="/"
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-black dark:hover:bg-slate-200 transition shadow-md flex items-center justify-center gap-2"
                  >
                    <span>CONTINUE SHOPPING</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Printable Tax Invoice Container */}
              <div
                id="printable-invoice"
                className="p-8 sm:p-12 bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl font-mono text-xs space-y-8"
              >
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-300 pb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xl font-black tracking-widest uppercase text-slate-900">
                      <Sparkles className="w-5 h-5 text-orange-500 fill-orange-500" />
                      <span>ENGULFIC</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      HIGH-DENSITY ARCHITECTURAL STREETWEAR
                    </p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      House 42, Banani Avenue, Dhaka 1213, Bangladesh<br />
                      Support: +880 1712-345678 • support@engulfic.com<br />
                      BIN / TAX REG: BD-948120491
                    </p>
                  </div>

                  <div className="sm:text-right space-y-1">
                    <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-600 font-bold text-[10px] uppercase rounded border border-orange-500/20">
                      OFFICIAL TAX INVOICE
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{orderId}</h3>
                    <p className="text-[11px] text-slate-600">
                      Date: <strong className="text-slate-900">{orderSummary?.date || new Date().toLocaleDateString()}</strong>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Payment Status: <strong className="text-emerald-600 font-bold">Cash on Delivery (COD)</strong>
                    </p>
                  </div>
                </div>

                {/* Customer Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">
                      BILLED TO:
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      {orderSummary?.billing?.firstName} {orderSummary?.billing?.lastName}
                    </p>
                    <p className="text-slate-700">{orderSummary?.billing?.address}</p>
                    <p className="text-slate-700">{orderSummary?.billing?.town}, {orderSummary?.billing?.district} ({orderSummary?.billing?.thana || 'Central'})</p>
                    <p className="text-slate-700">Phone: {orderSummary?.billing?.phone}</p>
                    <p className="text-slate-700">Email: {orderSummary?.billing?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">
                      DELIVERY DESTINATION:
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      {orderSummary?.shipping?.firstName} {orderSummary?.shipping?.lastName}
                    </p>
                    <p className="text-slate-700">{orderSummary?.shipping?.address}</p>
                    <p className="text-slate-700">{orderSummary?.shipping?.town}, {orderSummary?.shipping?.district}</p>
                    <p className="text-slate-700">Phone: {orderSummary?.shipping?.phone}</p>
                    <p className="text-slate-700 font-bold text-emerald-600">Method: Home Delivery (24-48 Hrs)</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                    ORDERED PIECES SUMMARY
                  </span>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase">
                        <tr>
                          <th className="py-3 px-4">Item Details</th>
                          <th className="py-3 px-4 text-center">Specs</th>
                          <th className="py-3 px-4 text-right">Unit Price</th>
                          <th className="py-3 px-4 text-center">Qty</th>
                          <th className="py-3 px-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {orderSummary?.items && orderSummary.items.length > 0 ? (
                          orderSummary.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                                    />
                                  )}
                                  <div>
                                    <p className="font-bold text-slate-900 uppercase">{item.name}</p>
                                    <p className="text-[10px] text-slate-500">{item.category || 'Garment'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="font-bold text-slate-900">{item.selectedSize || item.size || 'M'}</span> / <span className="text-slate-600">{item.selectedColor || item.color || 'Standard'}</span>
                              </td>
                              <td className="py-3.5 px-4 text-right">{formatPrice(item.price)}</td>
                              <td className="py-3.5 px-4 text-center font-bold">{item.quantity}</td>
                              <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                                {formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-4 px-4 text-center text-slate-500">
                              Order item records recorded.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary Calculation */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-300 pt-6">
                  <div className="space-y-2 text-[11px] text-slate-600 max-w-xs">
                    <span className="font-bold text-slate-900 uppercase block">TERMS & GUARANTEE</span>
                    <p>
                      • Garments are backed by Engulfic 7-day hassle-free replacement policy.<br />
                      • Please retain this official invoice for returns or exchanges.<br />
                      • Sealed in anti-static biodegradable packaging.
                    </p>
                  </div>

                  <div className="w-full sm:w-72 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">{formatPrice(orderSummary?.subtotal || 0)}</span>
                    </div>

                    {orderSummary?.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount ({orderSummary?.promoCode})</span>
                        <span>-{formatPrice(orderSummary.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                      <span>{orderSummary?.shippingInfo?.label || 'Delivery Fee'}</span>
                      <span className="font-bold text-slate-900">{formatPrice(orderSummary?.shippingCost || 0)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                      <span>AMOUNT PAYABLE</span>
                      <span className="text-orange-600">{formatPrice(orderSummary?.grandTotal || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Signature Line */}
                <div className="flex justify-between items-end border-t border-dashed border-slate-300 pt-6 text-[10px] text-slate-400">
                  <div>
                    <p>Computer Generated Official Invoice • No Physical Signature Required</p>
                    <p className="font-bold text-slate-600 mt-0.5">www.engulfic.com</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 uppercase">ENGULFIC QUALITY CONTROL</p>
                    <p>VERIFIED & PASSED</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
