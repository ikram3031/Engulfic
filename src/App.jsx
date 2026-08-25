import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './core/context/AppContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Product from './pages/Product';
import Profile from './pages/Profile';
import RefundPolicy from './pages/RefundPolicy';
import SizeGuide from './pages/SizeGuide';
import Terms from './pages/Terms';
import Wishlist from './pages/Wishlist';
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange';
import CartDrawer from './components/CartDrawer';

// Main application root with global router, context provider, and routes
const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<Catalog />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/shop/:id" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
        <CartDrawer />
      </div>
    </BrowserRouter>
    </AppProvider>
  );
}

export default App;
