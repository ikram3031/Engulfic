import { create } from 'zustand';

const initialOrders = [
  {
    id: 'ENG-89421',
    date: '2026-07-22',
    status: 'Delivered',
    statusColor: 'emerald',
    total: 340.00,
    items: [
      { id: '1', name: 'OVERSIZED HEAVYWEIGHT HOODIE', color: 'Midnight Black', size: 'L', price: 180.00, quantity: 1, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80' },
      { id: '2', name: 'ARCHIVAL UTILITY CARGO PANTS', color: 'Olive Green', size: 'M', price: 160.00, quantity: 1, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80' }
    ],
    shippingAddress: 'House 42, Road 11, Block D, Banani, Dhaka, Bangladesh',
    paymentMethod: 'Credit Card (**** 4242)',
    trackingNumber: 'TRK-902184912'
  },
  {
    id: 'ENG-78105',
    date: '2026-07-10',
    status: 'In Transit',
    statusColor: 'amber',
    total: 210.00,
    items: [
      { id: '3', name: 'MONOCHROME EMBOSSED SWEATSHIRT', color: 'Washed Ash', size: 'XL', price: 210.00, quantity: 1, image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80' }
    ],
    shippingAddress: 'House 42, Road 11, Block D, Banani, Dhaka, Bangladesh',
    paymentMethod: 'Cash on Delivery',
    trackingNumber: 'TRK-301984210'
  }
];

export const useAuthStore = create((set) => ({
  isLoggedIn: true, // Default to logged in so user can view profile right away
  user: {
    name: 'Ikramul Hossen',
    email: 'ikramul.hossen3031@gmail.com',
    phone: '+880 1712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    city: 'Dhaka',
    zipCode: '1213',
    tier: 'VIP Member (5% Extra Off)',
    discountCode: 'ENGULF5',
    memberSince: 'January 2025'
  },
  orders: initialOrders,

  login: (email) => {
    const userObj = {
      name: email ? (email.split('@')[0] || 'Member') : 'Member',
      email: email || 'ikramul.hossen3031@gmail.com',
      phone: '+880 1712-345678',
      address: 'House 42, Road 11, Block D, Banani, Dhaka',
      city: 'Dhaka',
      zipCode: '1213',
      tier: 'VIP Member (5% Extra Off)',
      discountCode: 'ENGULF5',
      memberSince: 'July 2026'
    };
    set({ isLoggedIn: true, user: userObj });
    return userObj;
  },

  logout: () => {
    set({ isLoggedIn: false, user: null });
  },

  updateProfile: (updatedData) => {
    set((state) => ({
      user: {
        ...state.user,
        ...updatedData
      }
    }));
  }
}));

