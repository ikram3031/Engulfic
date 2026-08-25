/**
 * Meta Pixel & Conversions API (CAPI) Tracking Utility
 * Provides dual-event tracking (Browser fbq + Server CAPI) with automatic event deduplication.
 */

export const FB_PIXEL_ID =
  import.meta.env?.VITE_FB_PIXEL_ID || '881944871465552';

export const FB_ACCESS_TOKEN =
  import.meta.env?.VITE_FB_ACCESS_TOKEN ||
  'EABA1t6647xYBSeowtZCJaLEZA4xRVRqZAjZC4fvjnyetRIoPJUnvl5GdAqxeC4QSMAuJIw7afyL6fJlDDWzjLOZA5HRLvNIJSQP4ZCGIwNQgNQFINQnHd66PeC3rzfMnGd2yXNlKS7t814U7jgfFQWLv9gMSw60ntqOMDXZBDXdKd9VpcuSgvlTYzHFGadc0MzVKAZDZD';

export const FB_TEST_EVENT_CODE =
  import.meta.env?.VITE_FB_TEST_EVENT_CODE || 'TEST23267';

// Generates a unique event ID for Meta deduplication
export const generateEventId = (eventName = 'event') => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${eventName.toLowerCase()}_${timestamp}_${randomStr}`;
};

// Computes SHA-256 hash in browser environment for CAPI user data compliance
export const sha256Hash = async (value) => {
  if (!value || typeof value !== 'string') return '';
  const cleanVal = value.trim().toLowerCase();
  if (!cleanVal) return '';

  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(cleanVal);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('[Meta CAPI] SHA-256 hash calculation skipped:', err);
  }
  return '';
};

// Normalizes and formats Bangladeshi phone numbers for Meta CAPI
export const normalizePhone = (phone = '') => {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return `88${digits}`;
  }
  if (digits.length === 10) {
    return `880${digits}`;
  }
  return digits;
};

// Dispatches an event directly to Meta Conversions API (CAPI)
export const sendMetaCapiEvent = async ({
  eventName,
  eventId,
  customData = {},
  userData = {},
  eventSourceUrl = typeof window !== 'undefined' ? window.location.href : '',
}) => {
  if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) return;

  try {
    const hashedEmail = userData.email ? await sha256Hash(userData.email) : '';
    const normalizedPhone = userData.phone ? normalizePhone(userData.phone) : '';
    const hashedPhone = normalizedPhone ? await sha256Hash(normalizedPhone) : '';
    const hashedFirstName = userData.firstName ? await sha256Hash(userData.firstName) : '';
    const hashedLastName = userData.lastName ? await sha256Hash(userData.lastName) : '';
    const hashedCity = userData.city || userData.town ? await sha256Hash(userData.city || userData.town) : '';
    const hashedCountry = await sha256Hash('bd');

    const formattedUserData = {
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...(hashedEmail ? { em: [hashedEmail] } : {}),
      ...(hashedPhone ? { ph: [hashedPhone] } : {}),
      ...(hashedFirstName ? { fn: [hashedFirstName] } : {}),
      ...(hashedLastName ? { ln: [hashedLastName] } : {}),
      ...(hashedCity ? { ct: [hashedCity] } : {}),
      ...(hashedCountry ? { country: [hashedCountry] } : {}),
    };

    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: formattedUserData,
      custom_data: customData,
    };

    const requestBody = {
      data: [eventPayload],
      ...(FB_TEST_EVENT_CODE ? { test_event_code: FB_TEST_EVENT_CODE } : {}),
    };

    const endpoint = `https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`;

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      keepalive: true,
    }).catch((capiErr) => {
      console.warn('[Meta CAPI] Dispatch error:', capiErr);
    });
  } catch (err) {
    console.warn('[Meta CAPI] Request builder error:', err);
  }
};

// Core multi-channel tracking dispatcher (Browser fbq + CAPI)
export const trackMetaEvent = (eventName, params = {}, options = {}) => {
  const eventId = options.eventId || generateEventId(eventName);
  const userData = options.userData || {};

  // 1. Browser Pixel tracking via window.fbq
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, params, { eventID: eventId });
    } catch (fbqErr) {
      console.warn('[Meta Pixel] Browser track error:', fbqErr);
    }
  }

  // 2. Server-Side Conversions API (CAPI) tracking
  sendMetaCapiEvent({
    eventName,
    eventId,
    customData: params,
    userData,
    eventSourceUrl: options.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : ''),
  });

  return eventId;
};

// Tracks standard PageView event on route change
export const trackPageView = (url, title) => {
  return trackMetaEvent('PageView', {
    page_path: url || (typeof window !== 'undefined' ? window.location.pathname : ''),
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
  });
};

// Tracks ViewContent event when a product page or quick view modal is opened
export const trackViewContent = (product) => {
  if (!product) return;
  const productId = String(product.did || product.sku || product.id || product._id || '');
  const price = Number(product.price || 0);
  const category = typeof product.category === 'object' ? product.category?.name : (product.category || 'Apparel');

  return trackMetaEvent('ViewContent', {
    content_name: product.name || 'Product',
    content_category: category,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    value: price,
    currency: 'BDT',
  });
};

// Tracks AddToCart event when a product is added to the cart
export const trackAddToCart = (product, quantity = 1, size = '', color = '') => {
  if (!product) return;
  const productId = String(product.did || product.sku || product.id || product._id || '');
  const unitPrice = Number(product.price || 0);
  const totalValue = unitPrice * (quantity || 1);
  const category = typeof product.category === 'object' ? product.category?.name : (product.category || 'Apparel');

  return trackMetaEvent('AddToCart', {
    content_name: product.name || 'Product',
    content_category: category,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    value: totalValue,
    currency: 'BDT',
    num_items: quantity || 1,
    contents: [
      {
        id: productId,
        quantity: quantity || 1,
        item_price: unitPrice,
        size: size || undefined,
        color: color || undefined,
      },
    ],
  });
};

// Tracks AddToWishlist event when a product is added to the wishlist
export const trackAddToWishlist = (product) => {
  if (!product) return;
  const productId = String(product.did || product.sku || product.id || product._id || '');
  const price = Number(product.price || 0);
  const category = typeof product.category === 'object' ? product.category?.name : (product.category || 'Apparel');

  return trackMetaEvent('AddToWishlist', {
    content_name: product.name || 'Product',
    content_category: category,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    value: price,
    currency: 'BDT',
  });
};

// Tracks InitiateCheckout event when the user navigates or opens checkout
export const trackInitiateCheckout = (cart = [], totalAmount = 0, numItems = 0) => {
  const contentIds = cart
    .map((item) => String(item.did || item.sku || item.id || item._id || ''))
    .filter(Boolean);

  const contents = cart.map((item) => ({
    id: String(item.did || item.sku || item.id || item._id || ''),
    quantity: item.quantity || 1,
    item_price: Number(item.price || 0),
  }));

  const calculatedItemsCount = numItems || cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return trackMetaEvent('InitiateCheckout', {
    content_ids: contentIds,
    contents: contents,
    content_type: 'product',
    value: Number(totalAmount || 0),
    currency: 'BDT',
    num_items: calculatedItemsCount,
  });
};

// Tracks AddPaymentInfo event during checkout payment method selection
export const trackAddPaymentInfo = (cart = [], totalAmount = 0, paymentMethod = 'cod') => {
  const contentIds = cart
    .map((item) => String(item.did || item.sku || item.id || item._id || ''))
    .filter(Boolean);

  return trackMetaEvent('AddPaymentInfo', {
    content_ids: contentIds,
    content_type: 'product',
    value: Number(totalAmount || 0),
    currency: 'BDT',
    payment_method: paymentMethod,
  });
};

// Tracks Purchase event upon successful order placement
export const trackPurchase = ({
  orderId,
  total,
  subtotal,
  shippingCost = 0,
  items = [],
  customer = {},
}) => {
  const contentIds = items
    .map((item) => String(item.did || item.sku || item.id || item._id || item.productId || ''))
    .filter(Boolean);

  const contents = items.map((item) => ({
    id: String(item.did || item.sku || item.id || item._id || item.productId || ''),
    name: item.name,
    quantity: item.quantity || 1,
    item_price: Number(item.price || item.unitPrice || 0),
    size: item.selectedSize || item.size,
  }));

  const totalQuantity = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  const userData = {
    email: customer.email || '',
    phone: customer.phone || '',
    firstName: customer.firstName || customer.fullName?.split(' ')[0] || '',
    lastName: customer.lastName || customer.fullName?.split(' ').slice(1).join(' ') || '',
    city: customer.town || customer.district || customer.city || '',
    address: customer.address || '',
  };

  const eventId = `purchase_${orderId || Date.now()}`;

  return trackMetaEvent(
    'Purchase',
    {
      content_name: 'Order Purchase',
      content_ids: contentIds,
      contents: contents,
      content_type: 'product',
      value: Number(total || 0),
      currency: 'BDT',
      num_items: totalQuantity,
      order_id: String(orderId || ''),
    },
    {
      eventId,
      userData,
    }
  );
};

// Tracks Search event when searching items in catalog or search modal
export const trackSearch = (searchQuery = '') => {
  if (!searchQuery || !searchQuery.trim()) return;
  return trackMetaEvent('Search', {
    search_string: searchQuery.trim(),
    content_type: 'product',
  });
};

// Tracks Contact event when a message is submitted through contact form
export const trackContact = (userData = {}) => {
  return trackMetaEvent(
    'Contact',
    {
      content_name: 'Contact Form Submission',
    },
    {
      userData,
    }
  );
};
