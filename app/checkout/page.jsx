'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatPrice } from '@/lib/utils';
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
  Truck
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
  const router = useRouter();
  const { cart, getSubtotal, getDiscountAmount, promoCode, applyPromoCode, removePromoCode, clearCart } = useCartStore();
  const { isLoggedIn, user, login, logout, updateProfile } = useAuthStore();

  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Checkout Form, 2: Order Complete
  const [orderId, setOrderId] = useState('');

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

  // Billing address form
  const [billingForm, setBillingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    town: '',
    district: 'Dhaka',
    selectThana: true,
    thana: 'Mohammadpur'
  });

  // Shipping address form (different address)
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    town: '',
    district: 'Dhaka',
    selectThana: true,
    thana: 'Mohammadpur'
  });

  // Pre-fill fields if user is already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      const timer = setTimeout(() => {
        setBillingForm((prev) => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          town: user.city || '',
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
    const activeSelectThana = shipToDifferent ? shippingForm.selectThana : billingForm.selectThana;

    if (!activeDistrict) {
      return { cost: 0, label: 'Delivery Charge' };
    }

    if (activeDistrict.toLowerCase() === 'dhaka') {
      if (activeSelectThana && activeThana === 'Savar') {
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
  const handlePlaceOrder = (e) => {
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

    // Place order
    const generatedId = `ENG-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setStep(2);
    clearCart();
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
                <Link
                  href="/"
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
                      </div>

                      {/* Optional Thana selector if Dhaka is selected */}
                      {billingForm.district.toLowerCase() === 'dhaka' && (
                        <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="selectThana"
                              checked={billingForm.selectThana}
                              onChange={handleBillingChange}
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 dark:border-white/10 bg-transparent focus:ring-orange-500 focus:ring-2"
                            />
                            <span className="text-xs font-mono font-bold text-slate-800 dark:text-white/90">Select Thana / Area under Dhaka</span>
                          </label>

                          {billingForm.selectThana && (
                            <div className="animate-fadeIn pl-6">
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Thana Dropdown</label>
                              <select
                                name="thana"
                                value={billingForm.thana}
                                onChange={handleBillingChange}
                                className="w-full max-w-xs bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              >
                                <option value="Mohammadpur" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Mohammadpur (Inside Dhaka - 70 Taka)</option>
                                <option value="Savar" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Savar (Dhaka Suburbs - 100 Taka)</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}
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
                        </div>

                        {shippingForm.district.toLowerCase() === 'dhaka' && (
                          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="selectThana"
                                checked={shippingForm.selectThana}
                                onChange={handleShippingChange}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 dark:border-white/10 bg-transparent focus:ring-orange-500 focus:ring-2"
                              />
                              <span className="text-xs font-mono font-bold text-slate-800 dark:text-white/90">Select Thana / Area under Dhaka</span>
                            </label>

                            {shippingForm.selectThana && (
                              <div className="animate-fadeIn pl-6">
                                <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Thana Dropdown</label>
                                <select
                                  name="thana"
                                  value={shippingForm.thana}
                                  onChange={handleShippingChange}
                                  className="w-full max-w-xs bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                                >
                                  <option value="Mohammadpur" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Mohammadpur (Inside Dhaka - 70 Taka)</option>
                                  <option value="Savar" className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">Savar (Dhaka Suburbs - 100 Taka)</option>
                                </select>
                              </div>
                            )}
                          </div>
                        )}
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
                              ? `Based on shipping to ${shippingForm.district}${shippingForm.district.toLowerCase() === 'dhaka' && shippingForm.selectThana ? ` (${shippingForm.thana})` : ''}`
                              : `Based on billing to ${billingForm.district}${billingForm.district.toLowerCase() === 'dhaka' && billingForm.selectThana ? ` (${billingForm.thana})` : ''}`
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
            /* Order Confirmed Step 2 */
            <div className="max-w-xl mx-auto py-12 px-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl text-center space-y-6 animate-fadeIn shadow-2xl">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-300 text-xs font-mono rounded-full border border-orange-500/30">
                  ORDER PLACED
                </span>
                <h2 className="text-3xl font-black uppercase mt-4 tracking-wide">Thank You!</h2>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-2 font-mono">
                  Your order <strong className="text-orange-500 font-bold">{orderId}</strong> is processed and prepared for delivery.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/10 text-left text-xs font-mono space-y-2.5 text-slate-700 dark:text-white/70">
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span>Shipping Address:</span>
                  <span className="text-slate-900 dark:text-white font-bold max-w-[200px] text-right truncate">
                    {shipToDifferent 
                      ? `${shippingForm.firstName} ${shippingForm.lastName}, ${shippingForm.address}, ${shippingForm.town}, ${shippingForm.district}`
                      : `${billingForm.firstName} ${billingForm.lastName}, ${billingForm.address}, ${billingForm.town}, ${billingForm.district}`
                    }
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span>Payment Method:</span>
                  <span className="text-slate-900 dark:text-white font-bold">Cash on Delivery (COD)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">24-48 Hours (Home Delivery)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="w-full py-4 bg-orange-500 text-white hover:bg-orange-600 font-extrabold uppercase tracking-widest text-xs rounded-2xl transition border border-orange-400/30 shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Continue to Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
