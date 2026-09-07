const BASE_URL = import.meta.env?.VITE_API_URL || 'https://server.engulfic.com';

export const FB_PIXEL_ID = import.meta.env?.VITE_FB_PIXEL_ID || '881944871465552';

export const FB_ACCESS_TOKEN =
  import.meta.env?.VITE_FB_ACCESS_TOKEN ||
  'EABA1t6647xYBSeowtZCJaLEZA4xRVRqZAjZC4fvjnyetRIoPJUnvl5GdAqxeC4QSMAuJIw7afyL6fJlDDWzjLOZA5HRLvNIJSQP4ZCGIwNQgNQFINQnHd66PeC3rzfMnGd2yXNlKS7t814U7jgfFQWLv9gMSw60ntqOMDXZBDXdKd9VpcuSgvlTYzHFGadc0MzVKAZDZD';

export const FB_TEST_EVENT_CODE = import.meta.env?.VITE_FB_TEST_EVENT_CODE || 'TEST23267';

export const DEFAULT_TIKTOK_PIXEL_ID = import.meta.env?.VITE_TIKTOK_PIXEL_ID || '';

let activeMetaPixelId = null;
let activeTikTokPixelId = null;
let isInitializing = false;

// Generates unique deduplication event ID
export const generateEventId = (eventName = 'event') => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${eventName.toLowerCase()}_${timestamp}_${randomStr}`;
};

// Calculates SHA-256 hash string for user data hashing
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

// Normalizes phone numbers with country dialing prefix
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

// Injects Meta Pixel script tag dynamically
const injectMetaScript = (pixelId) => {
  if (typeof window === 'undefined' || !pixelId) return;

  if (!window.fbq) {
    const f = window;
    const b = document;
    const e = 'script';
    const v = 'https://connect.facebook.net/en_US/fbevents.js';
    if (f.fbq) return;
    const n = (f.fbq = () => {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e);
    t.async = !0;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }

  if (activeMetaPixelId !== pixelId) {
    window.fbq('init', pixelId);
    activeMetaPixelId = pixelId;
  }
};

// Injects TikTok Pixel snippet tag dynamically
const injectTikTokScript = (pixelId) => {
  if (typeof window === 'undefined' || !pixelId) return;

  if (!window.ttq) {
    ((w, d, t) => {
      w.TiktokAnalyticsObject = t;
      const ttq = (w[t] = w[t] || []);
      ttq.methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
        'holdConsent',
        'revokeConsent',
        'grantConsent',
      ];
      ttq.setAndDefer = (target, method) => {
        target[method] = () => {
          target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.instance = (target) => {
        for (let e = ttq._i[target] || [], n = 0; n < ttq.methods.length; n++) {
          ttq.setAndDefer(e, ttq.methods[n]);
        }
        return e;
      };
      ttq.load = (e, n) => {
        const r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        const scriptTag = d.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = `${r}?sdkid=${e}&lib=${t}`;
        const s = d.getElementsByTagName(scriptTag)[0] || d.head || d.body;
        if (s) {
          s.appendChild(scriptTag);
        }
      };
    })(window, document, 'ttq');
  }

  if (activeTikTokPixelId !== pixelId) {
    window.ttq.load(pixelId);
    window.ttq.page();
    activeTikTokPixelId = pixelId;
  }
};

// Loads dynamic tracking pixel credentials and initializes browser engines
export const initTrackingPixels = async () => {
  if (typeof window === 'undefined') return;

  if (FB_PIXEL_ID) {
    injectMetaScript(FB_PIXEL_ID);
  }
  if (DEFAULT_TIKTOK_PIXEL_ID) {
    injectTikTokScript(DEFAULT_TIKTOK_PIXEL_ID);
  }

  if (isInitializing) return;
  isInitializing = true;

  try {
    const [metaRes, tiktokRes] = await Promise.allSettled([
      fetch(`${BASE_URL}/api/v1/settings/public/meta-pixel`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${BASE_URL}/api/v1/settings/public/tiktok-pixel`).then((r) => (r.ok ? r.json() : null)),
    ]);

    const metaData = metaRes.status === 'fulfilled' ? metaRes.value?.data : null;
    const tiktokData = tiktokRes.status === 'fulfilled' ? tiktokRes.value?.data : null;

    const targetMetaId = metaData?.isEnabled && metaData?.enableBrowserPixel && metaData?.pixelId
      ? metaData.pixelId
      : FB_PIXEL_ID;

    if (targetMetaId) {
      injectMetaScript(targetMetaId);
    }

    const targetTikTokId = tiktokData?.isEnabled && tiktokData?.enableBrowserPixel && tiktokData?.pixelId
      ? tiktokData.pixelId
      : DEFAULT_TIKTOK_PIXEL_ID;

    if (targetTikTokId) {
      injectTikTokScript(targetTikTokId);
    }
  } catch (err) {
    console.warn('[Pixel Tracker] Initialization error:', err.message);
  } finally {
    isInitializing = false;
  }
};

// Dispatches server conversion event payload to Meta Graph API
export const sendMetaCapiEvent = async ({
  eventName,
  eventId,
  customData = {},
  userData = {},
  eventSourceUrl = typeof window !== 'undefined' ? window.location.href : '',
}) => {
  const currentPixelId = activeMetaPixelId || FB_PIXEL_ID;
  if (!currentPixelId || !FB_ACCESS_TOKEN) return;

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

    const endpoint = `https://graph.facebook.com/v19.0/${currentPixelId}/events?access_token=${FB_ACCESS_TOKEN}`;

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

// Dispatches unified browser and server event across Meta tracking
export const trackMetaEvent = (eventName, params = {}, options = {}) => {
  const eventId = options.eventId || generateEventId(eventName);
  const userData = options.userData || {};

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, params, { eventID: eventId });
    } catch (fbqErr) {
      console.warn('[Meta Pixel] Browser track error:', fbqErr);
    }
  }

  sendMetaCapiEvent({
    eventName,
    eventId,
    customData: params,
    userData,
    eventSourceUrl: options.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : ''),
  });

  return eventId;
};

// Tracks standard PageView event across Meta and TikTok engines
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.page();
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] PageView error:', ttqErr);
    }
  }

  return trackMetaEvent('PageView', {
    page_path: url || (typeof window !== 'undefined' ? window.location.pathname : ''),
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
  });
};

// Tracks ViewContent event when a product page or modal is opened
export const trackViewContent = (product) => {
  if (!product) return;
  const productId = String(product.did || product.sku || product.id || product._id || '');
  const price = Number(product.price || 0);
  const category = typeof product.category === 'object' ? product.category?.name : (product.category || 'Apparel');

  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track('ViewContent', {
        content_id: productId,
        content_type: 'product',
        content_name: product.name || 'Product',
        quantity: 1,
        price,
        value: price,
        currency: 'BDT',
      });
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] ViewContent error:', ttqErr);
    }
  }

  return trackMetaEvent('ViewContent', {
    content_name: product.name || 'Product',
    content_category: category,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    value: price,
    currency: 'BDT',
  });
};

// Tracks AddToCart event when an item is added to cart
export const trackAddToCart = (product, quantity = 1, size = '', color = '') => {
  if (!product) return;
  const productId = String(product.did || product.sku || product.id || product._id || '');
  const unitPrice = Number(product.price || 0);
  const totalValue = unitPrice * (quantity || 1);
  const category = typeof product.category === 'object' ? product.category?.name : (product.category || 'Apparel');

  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track('AddToCart', {
        content_id: productId,
        content_type: 'product',
        content_name: product.name || 'Product',
        quantity: quantity || 1,
        price: unitPrice,
        value: totalValue,
        currency: 'BDT',
      });
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] AddToCart error:', ttqErr);
    }
  }

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

// Tracks AddToWishlist event when a product is saved to wishlist
export const trackAddToWishlist = (product) => {
  if (!product) return;
  const productId = String(product.did || product.sku || product.id || product._id || '');
  const price = Number(product.price || 0);
  const category = typeof product.category === 'object' ? product.category?.name : (product.category || 'Apparel');

  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track('AddToWishlist', {
        content_id: productId,
        content_type: 'product',
        content_name: product.name || 'Product',
        price,
        value: price,
        currency: 'BDT',
      });
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] AddToWishlist error:', ttqErr);
    }
  }

  return trackMetaEvent('AddToWishlist', {
    content_name: product.name || 'Product',
    content_category: category,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    value: price,
    currency: 'BDT',
  });
};

// Tracks InitiateCheckout event when checkout process begins
export const trackInitiateCheckout = (cart = [], totalAmount = 0, numItems = 0) => {
  const contentIds = cart
    .map((item) => String(item.did || item.sku || item.id || item._id || ''))
    .filter(Boolean);

  const contents = cart.map((item) => ({
    id: String(item.did || item.sku || item.id || item._id || ''),
    name: item.name || '',
    quantity: item.quantity || 1,
    item_price: Number(item.price || 0),
  }));

  const calculatedItemsCount = numItems || cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track('InitiateCheckout', {
        contents: contents.map((c) => ({
          content_id: c.id,
          content_name: c.name,
          quantity: c.quantity,
          price: c.item_price,
        })),
        value: Number(totalAmount || 0),
        currency: 'BDT',
      });
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] InitiateCheckout error:', ttqErr);
    }
  }

  return trackMetaEvent('InitiateCheckout', {
    content_ids: contentIds,
    contents,
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

  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track(
        'CompletePayment',
        {
          contents: contents.map((c) => ({
            content_id: c.id,
            content_name: c.name,
            quantity: c.quantity,
            price: c.item_price,
          })),
          value: Number(total || 0),
          currency: 'BDT',
          order_id: String(orderId || ''),
        },
        { event_id: eventId }
      );
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] CompletePayment error:', ttqErr);
    }
  }

  return trackMetaEvent(
    'Purchase',
    {
      content_name: 'Order Purchase',
      content_ids: contentIds,
      contents,
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

  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track('Search', {
        query: searchQuery.trim(),
      });
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] Search error:', ttqErr);
    }
  }

  return trackMetaEvent('Search', {
    search_string: searchQuery.trim(),
    content_type: 'product',
  });
};

// Tracks Contact event when a message is submitted through contact form
export const trackContact = (userData = {}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track('Contact');
    } catch (ttqErr) {
      console.warn('[TikTok Pixel] Contact error:', ttqErr);
    }
  }

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
