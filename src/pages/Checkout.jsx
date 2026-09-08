'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  useNavigate  } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import ReCaptcha from '@/components/ReCaptcha';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatPrice } from '@/lib/utils';
import { createOrder, loginMember, registerMember } from '@/lib/api';
import {
  trackInitiateCheckout,
  trackAddPaymentInfo,
  trackPurchase,
} from '@/lib/metaPixel';
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
  Building2,
  ChevronDown,
  ChevronUp
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

const DISTRICT_THANAS = {
  Dhaka: [
    { name: 'Adabor', fee: 70, type: 'Inside Dhaka' },
    { name: 'Ashulia', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Badda', fee: 70, type: 'Inside Dhaka' },
    { name: 'Banani', fee: 70, type: 'Inside Dhaka' },
    { name: 'Bangshal', fee: 70, type: 'Inside Dhaka' },
    { name: 'Cantonment', fee: 70, type: 'Inside Dhaka' },
    { name: 'Chawkbazar', fee: 70, type: 'Inside Dhaka' },
    { name: 'Dakshinkhan', fee: 70, type: 'Inside Dhaka' },
    { name: 'Darussalam', fee: 70, type: 'Inside Dhaka' },
    { name: 'Demra', fee: 70, type: 'Inside Dhaka' },
    { name: 'Dhamrai', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Dhanmondi', fee: 70, type: 'Inside Dhaka' },
    { name: 'Dohar', fee: 120, type: 'Outside Dhaka' },
    { name: 'Gendaria', fee: 70, type: 'Inside Dhaka' },
    { name: 'Gulshan', fee: 70, type: 'Inside Dhaka' },
    { name: 'Hazaribagh', fee: 70, type: 'Inside Dhaka' },
    { name: 'Jatrabari', fee: 70, type: 'Inside Dhaka' },
    { name: 'Kadamtali', fee: 70, type: 'Inside Dhaka' },
    { name: 'Kafrul', fee: 70, type: 'Inside Dhaka' },
    { name: 'Kalabagan', fee: 70, type: 'Inside Dhaka' },
    { name: 'Kamrangirchar', fee: 70, type: 'Inside Dhaka' },
    { name: 'Keraniganj', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Khilgaon', fee: 70, type: 'Inside Dhaka' },
    { name: 'Khilkhet', fee: 70, type: 'Inside Dhaka' },
    { name: 'Kotwali', fee: 70, type: 'Inside Dhaka' },
    { name: 'Lalbagh', fee: 70, type: 'Inside Dhaka' },
    { name: 'Mirpur', fee: 70, type: 'Inside Dhaka' },
    { name: 'Mohammadpur', fee: 70, type: 'Inside Dhaka' },
    { name: 'Motijheel', fee: 70, type: 'Inside Dhaka' },
    { name: 'Mugda', fee: 70, type: 'Inside Dhaka' },
    { name: 'Nawabganj', fee: 120, type: 'Outside Dhaka' },
    { name: 'New Market', fee: 70, type: 'Inside Dhaka' },
    { name: 'Pallabi', fee: 70, type: 'Inside Dhaka' },
    { name: 'Paltan', fee: 70, type: 'Inside Dhaka' },
    { name: 'Ramna', fee: 70, type: 'Inside Dhaka' },
    { name: 'Rampura', fee: 70, type: 'Inside Dhaka' },
    { name: 'Sabujbagh', fee: 70, type: 'Inside Dhaka' },
    { name: 'Savar', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Shah Ali', fee: 70, type: 'Inside Dhaka' },
    { name: 'Shahbagh', fee: 70, type: 'Inside Dhaka' },
    { name: 'Sher-e-Bangla Nagar', fee: 70, type: 'Inside Dhaka' },
    { name: 'Shyampur', fee: 70, type: 'Inside Dhaka' },
    { name: 'Sutrapur', fee: 70, type: 'Inside Dhaka' },
    { name: 'Tejgaon', fee: 70, type: 'Inside Dhaka' },
    { name: 'Tejgaon Industrial Area', fee: 70, type: 'Inside Dhaka' },
    { name: 'Turag', fee: 70, type: 'Inside Dhaka' },
    { name: 'Uttara Paschim', fee: 70, type: 'Inside Dhaka' },
    { name: 'Uttara Purba', fee: 70, type: 'Inside Dhaka' },
    { name: 'Uttarkhan', fee: 70, type: 'Inside Dhaka' },
    { name: 'Vatara', fee: 70, type: 'Inside Dhaka' },
    { name: 'Wari', fee: 70, type: 'Inside Dhaka' }
  ],
  Gazipur: [
    { name: 'Gazipur Sadar', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Kaliakair', fee: 120, type: 'Outside Dhaka' },
    { name: 'Kaliganj', fee: 120, type: 'Outside Dhaka' },
    { name: 'Kapasia', fee: 120, type: 'Outside Dhaka' },
    { name: 'Kashimpur', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Konabari', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Sreepur', fee: 120, type: 'Outside Dhaka' },
    { name: 'Tongi', fee: 100, type: 'Dhaka Suburbs' }
  ],
  Narayanganj: [
    { name: 'Araihazar', fee: 120, type: 'Outside Dhaka' },
    { name: 'Bandar', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Fatullah', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Narayanganj Sadar', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Rupganj', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Siddhirganj', fee: 100, type: 'Dhaka Suburbs' },
    { name: 'Sonargaon', fee: 100, type: 'Dhaka Suburbs' }
  ]
};

// Sort all thanas alphabetically
Object.keys(DISTRICT_THANAS).forEach((key) => {
  DISTRICT_THANAS[key].sort((a, b) => a.name.localeCompare(b.name));
});

// Handles end-to-end checkout flow, address collection, order generation, and Meta Pixel Purchase tracking
const CheckoutPage = () => {
  const router = useNavigate();
  const { cart, getSubtotal, getDiscountAmount, promoCode, applyPromoCode, removePromoCode, clearCart, closeCart } = useCartStore();
  const { isLoggedIn, user, login, logout, updateProfile } = useAuthStore();

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);
  const [isCustomerAccountOpen, setIsCustomerAccountOpen] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);

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
    district: '',
    thana: ''
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
    district: '',
    thana: ''
  });

  // Pre-fill billing form from logged-in user data
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
          district: user.district || ''
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user]);

  // Track Meta Pixel InitiateCheckout on checkout terminal mount
  useEffect(() => {
    if (cart && cart.length > 0) {
      trackInitiateCheckout(cart, grandTotal || getSubtotal());
    }
  }, []);


  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'district' ? { thana: '' } : {})
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'district' ? { thana: '' } : {})
    }));
  };

  // Auth Submit handlers
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setToastMessage('Email and Password are required');
      return;
    }
    try {
      const res = await loginMember({ email: authEmail, password: authPassword });
      login(res.member || res.user, { accessToken: res.accessToken, refreshToken: res.refreshToken });
      setToastMessage(`Signed in successfully!`);
    } catch (err) {
      setToastMessage(err.message || 'Failed to sign in. Check your credentials.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!authEmail || !authFirstName || !authLastName || !authPhone) {
      setToastMessage('Please fill all required sign up fields');
      return;
    }
    const fullName = `${authFirstName} ${authLastName}`;
    try {
      const res = await registerMember({
        firstName: authFirstName,
        lastName: authLastName,
        email: authEmail,
        phone: authPhone,
        password: authPassword || '12345678', // fallback if they didn't have password field
      });
      // Optionally login after register
      if (res.accessToken) {
        login(res.member || res.user, { accessToken: res.accessToken, refreshToken: res.refreshToken });
        setToastMessage(`Account created! Welcome ${fullName}`);
      } else {
        setToastMessage(`Account created successfully! Please sign in.`);
        setAuthTab('signin');
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to create account.');
    }
  };

  // Shipping calculation
  const getCalculatedShipping = () => {
    if (cart.length === 0) return { cost: 0, label: 'Delivery Charge' };

    const activeDistrict = shipToDifferent ? shippingForm.district : billingForm.district;
    const activeThana = shipToDifferent ? shippingForm.thana : billingForm.thana;

    if (!activeDistrict) {
      return { cost: 0, label: 'Delivery Charge' };
    }

    const distLower = activeDistrict.toLowerCase().trim();

    if (distLower === 'dhaka') {
      const thanaObj = DISTRICT_THANAS.Dhaka.find(
        (t) => t.name.toLowerCase() === (activeThana || '').toLowerCase()
      );
      if (thanaObj) {
        return { cost: thanaObj.fee, label: `Delivery Charge (${thanaObj.type})` };
      }
      return { cost: 70, label: 'Delivery Charge (Inside Dhaka)' };
    }

    if (distLower === 'gazipur') {
      const thanaObj = DISTRICT_THANAS.Gazipur.find(
        (t) => t.name.toLowerCase() === (activeThana || '').toLowerCase()
      );
      if (thanaObj) {
        return { cost: thanaObj.fee, label: `Delivery Charge (${thanaObj.type})` };
      }
      return { cost: 100, label: 'Delivery Charge (Dhaka Suburbs)' };
    }

    if (distLower === 'narayanganj') {
      const thanaObj = DISTRICT_THANAS.Narayanganj.find(
        (t) => t.name.toLowerCase() === (activeThana || '').toLowerCase()
      );
      if (thanaObj) {
        return { cost: thanaObj.fee, label: `Delivery Charge (${thanaObj.type})` };
      }
      return { cost: 100, label: 'Delivery Charge (Dhaka Suburbs)' };
    }

    return { cost: 120, label: 'Delivery Charge (Outside Dhaka)' };
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

    if (!isRecaptchaVerified) {
      setToastMessage('Please complete the security reCAPTCHA verification.');
      return;
    }

    if (!billingForm.firstName || !billingForm.lastName || !billingForm.email || !billingForm.phone || !billingForm.address || !billingForm.town || !billingForm.district) {
      setToastMessage('Please fill in all mandatory billing fields.');
      return;
    }

    if (['Dhaka', 'Gazipur', 'Narayanganj'].includes(billingForm.district) && !billingForm.thana) {
      setToastMessage('Please select a Thana / Upazila for your billing district.');
      return;
    }

    if (shipToDifferent) {
      if (!shippingForm.firstName || !shippingForm.lastName || !shippingForm.email || !shippingForm.phone || !shippingForm.address || !shippingForm.town || !shippingForm.district) {
        setToastMessage('Please fill in all mandatory shipping fields.');
        return;
      }

      if (['Dhaka', 'Gazipur', 'Narayanganj'].includes(shippingForm.district) && !shippingForm.thana) {
        setToastMessage('Please select a Thana / Upazila for your shipping destination.');
        return;
      }
    }

    try {
      // Fire Meta Pixel AddPaymentInfo event
      trackAddPaymentInfo(cart, grandTotal, 'cod');

      // Build billingInfo and shippingInfo matching API spec (06_orders-api.md)
      const buildAddressInfo = (form) => ({
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        email: form.email,
        address: form.address,
        thana: form.thana || '',
        district: form.district,
        zip: form.zip || ''
      });

      const orderPayload = {
        memberId: isLoggedIn && user ? user.id : undefined,
        couponCode: promoCode || undefined,
        discountTotalAmount: discount || 0,
        billingInfo: buildAddressInfo(billingForm),
        shippingInfo: buildAddressInfo(shipToDifferent ? shippingForm : billingForm),
        paymentMethod: 'cod',
        subtotal,
        shippingFee: shippingCost,
        total: grandTotal,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          size: item.selectedSize || 'Standard'
        }))
      };

      const response = await createOrder(orderPayload);
      const generatedId = response.data?.orderNumber || response.orderNumber || `ENG-${Math.floor(100000 + Math.random() * 900000)}`;

      // Fire Meta Pixel Purchase event with transaction details and customer address data
      trackPurchase({
        orderId: generatedId,
        total: grandTotal,
        subtotal,
        shippingCost,
        items: cart,
        customer: shipToDifferent ? shippingForm : billingForm,
      });

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
                  <div className="bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => setIsCustomerAccountOpen(!isCustomerAccountOpen)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-full text-orange-500 border border-orange-500/20">
                          <User className="w-5 h-5 shrink-0" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-wide">1. Customer Account</h3>
                          {!isLoggedIn && (
                            <p className="text-xs text-slate-500 dark:text-white/60 mt-1 font-mono">
                              Existing member? <span className="text-orange-500 font-bold hover:underline">Sign in</span> or create a new member account.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {isCustomerAccountOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isCustomerAccountOpen || (isLoggedIn && user) ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
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
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Password *</label>
                              <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 uppercase mb-1">Phone Number *</label>
                              <input
                                type="tel"
                                name="phone"
                                autoComplete="tel"
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
                            type="tel"
                            name="phone"
                            autoComplete="tel"
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

                        {['Dhaka', 'Gazipur', 'Narayanganj'].includes(billingForm.district) && (
                          <div className="animate-fadeIn">
                            <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Thana *</label>
                            <select
                              name="thana"
                              value={billingForm.thana}
                              onChange={handleBillingChange}
                              required
                              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                            >
                              <option value="" disabled>Select Thana / Upazila</option>
                              {(DISTRICT_THANAS[billingForm.district] || []).map((t) => (
                                <option key={t.name} value={t.name} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                                  {t.name} ({t.type} - {t.fee} Taka)
                                </option>
                              ))}
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
                              type="tel"
                              name="phone"
                              autoComplete="tel"
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

                          {['Dhaka', 'Gazipur', 'Narayanganj'].includes(shippingForm.district) && (
                            <div className="animate-fadeIn">
                              <label className="block text-[11px] font-mono text-slate-600 dark:text-white/50 mb-1">Thana *</label>
                              <select
                                name="thana"
                                value={shippingForm.thana}
                                onChange={handleShippingChange}
                                required={shipToDifferent}
                                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500"
                              >
                                <option value="" disabled>Select Thana / Upazila</option>
                                {(DISTRICT_THANAS[shippingForm.district] || []).map((t) => (
                                  <option key={t.name} value={t.name} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                                    {t.name} ({t.type} - {t.fee} Taka)
                                  </option>
                                ))}
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

                    <div className="pt-2">
                      <ReCaptcha
                        onVerify={setIsRecaptchaVerified}
                        verified={isRecaptchaVerified}
                      />
                    </div>

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

                  {/* Checkout Notes & Important Info */}
                  <div className="p-6 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-3xl space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wide text-orange-600 dark:text-orange-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Important Information
                    </h4>
                    
                    <ul className="space-y-3 text-xs font-mono text-slate-700 dark:text-white/80">
                      <li className="flex items-start gap-2">
                        <Truck className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>Delivery takes <strong>24-48 hours</strong> inside Dhaka, and <strong>24-72 hours</strong> outside Dhaka.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Tag className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>For orders above <strong>৳3,000</strong>, a partial advance payment is required.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>For any inquiries, connect with us on <a href="https://www.facebook.com/Engulfclothing" target="_blank" rel="noreferrer" className="text-orange-500 font-bold hover:underline">Facebook</a> / <a href="https://www.instagram.com/engul_fic/" target="_blank" rel="noreferrer" className="text-orange-500 font-bold hover:underline">Instagram</a> or use our <Link to="/contact" className="text-orange-500 font-bold hover:underline">Contact form</Link>.</span>
                      </li>
                    </ul>

                    <div className="mt-4 p-4 bg-orange-500 text-white rounded-2xl shadow-xl border border-orange-400/50">
                      <p className="text-xs font-mono leading-relaxed flex items-start gap-2">
                        <User className="w-5 h-5 shrink-0" />
                        <span>
                          <strong>MEMBER BENEFIT:</strong> Create a registered account to unlock upcoming offers, exclusive drops, and special discounts!
                        </span>
                      </p>
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
                                    <p className="text-[10px] text-slate-500">{(typeof item.category === 'object' ? (item.category?.name || '') : item.category) || 'Garment'}</p>
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
                <div className="flex flex-col sm:flex-row justify-end items-start gap-6 border-t border-slate-300 pt-6">

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
};

export default CheckoutPage;
