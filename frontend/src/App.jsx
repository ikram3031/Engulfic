import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
