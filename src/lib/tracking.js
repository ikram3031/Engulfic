const BASE_URL = import.meta.env.VITE_API_URL || 'https://server.engulfic.com';

let metaPixelId = '';
let tiktokPixelId = '';
let isMetaLoaded = false;
let isTikTokLoaded = false;
let isInitializing = false;

// Dynamically injects Meta Pixel base script and stubs into document head
const injectMetaScript = (pixelId) => {
  if (typeof window === 'undefined' || !pixelId || isMetaLoaded) return;

  if (!window.fbq) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
  metaPixelId = pixelId;
  isMetaLoaded = true;
};

// Dynamically injects TikTok Pixel base script and stubs into document head
const injectTikTokScript = (pixelId) => {
  if (typeof window === 'undefined' || !pixelId || isTikTokLoaded) return;

  if (!window.ttq) {
    (function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
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
      ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e, n) {
        var r = 'https://analytics.tiktok.com/i18n/pixel/events.js',
          o = n && n.partner;
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        n = d.createElement('script');
        n.type = 'text/javascript';
        n.async = true;
        n.src = r + '?sdkid=' + e + '&lib=' + t;
        var s = d.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(n, s);
      };
    })(window, document, 'ttq');
  }

  window.ttq.load(pixelId);
  window.ttq.page();
  tiktokPixelId = pixelId;
  isTikTokLoaded = true;
};

// Fetches public tracking configurations and bootstraps Meta and TikTok pixels dynamically
export const initTrackingPixels = async () => {
  if (typeof window === 'undefined' || isInitializing || (isMetaLoaded && isTikTokLoaded)) return;
  isInitializing = true;

  try {
    const [metaRes, tiktokRes] = await Promise.allSettled([
      fetch(`${BASE_URL}/api/v1/settings/public/meta-pixel`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${BASE_URL}/api/v1/settings/public/tiktok-pixel`).then((r) => (r.ok ? r.json() : null)),
    ]);

    const metaData = metaRes.status === 'fulfilled' ? metaRes.value?.data : null;
    const tiktokData = tiktokRes.status === 'fulfilled' ? tiktokRes.value?.data : null;

    if (metaData?.isEnabled && metaData?.enableBrowserPixel && metaData?.pixelId) {
      injectMetaScript(metaData.pixelId);
    }

    if (tiktokData?.isEnabled && tiktokData?.enableBrowserPixel && tiktokData?.pixelId) {
      injectTikTokScript(tiktokData.pixelId);
    }
  } catch (err) {
    console.warn('[Pixel Tracker] Initialization failed:', err.message);
  } finally {
    isInitializing = false;
  }
};

// Dispatches PageView event across both Meta and TikTok tracking engines
export const trackPageView = (path) => {
  if (typeof window === 'undefined') return;

  if (isMetaLoaded && window.fbq) {
    window.fbq('track', 'PageView');
  }

  if (isTikTokLoaded && window.ttq) {
    window.ttq.page();
  }
};

// Dispatches ViewContent event when customer views a product page
export const trackViewContent = (product) => {
  if (typeof window === 'undefined' || !product) return;

  const contentId = String(product.did || product.id || product.raw?.id || product.slug || '');
  const price = Number(product.price || 0);

  if (isMetaLoaded && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: product.name,
      content_ids: [contentId],
      content_type: 'product',
      value: price,
      currency: 'BDT',
    });
  }

  if (isTikTokLoaded && window.ttq) {
    window.ttq.track('ViewContent', {
      content_id: contentId,
      content_type: 'product',
      content_name: product.name,
      quantity: 1,
      price: price,
      value: price,
      currency: 'BDT',
    });
  }
};

// Dispatches AddToCart event across both Meta and TikTok tracking engines
export const trackAddToCart = (product, quantity = 1, size = '', color = '') => {
  if (typeof window === 'undefined' || !product) return;

  const contentId = String(product.did || product.id || product.raw?.id || product.slug || '');
  const unitPrice = Number(product.price || 0);
  const totalValue = unitPrice * quantity;

  if (isMetaLoaded && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: product.name,
      content_ids: [contentId],
      content_type: 'product',
      value: totalValue,
      currency: 'BDT',
    });
  }

  if (isTikTokLoaded && window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: contentId,
      content_type: 'product',
      content_name: product.name,
      quantity: quantity,
      price: unitPrice,
      value: totalValue,
      currency: 'BDT',
    });
  }
};

// Dispatches InitiateCheckout event when customer opens the checkout page
export const trackInitiateCheckout = (cart = [], subtotal = 0) => {
  if (typeof window === 'undefined' || !Array.isArray(cart) || cart.length === 0) return;

  const contentIds = cart.map((i) => String(i.did || i.productDid || i.id || i.raw?.id || ''));
  const totalValue = Number(subtotal || 0);
  const numItems = cart.reduce((acc, i) => acc + Number(i.quantity || 1), 0);

  if (isMetaLoaded && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      num_items: numItems,
      value: totalValue,
      currency: 'BDT',
    });
  }

  if (isTikTokLoaded && window.ttq) {
    window.ttq.track('InitiateCheckout', {
      contents: cart.map((i) => ({
        content_id: String(i.did || i.productDid || i.id || i.raw?.id || ''),
        content_name: i.name,
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
      })),
      value: totalValue,
      currency: 'BDT',
    });
  }
};

// Dispatches Purchase and CompletePayment events with server deduplication ID
export const trackPurchase = ({ orderId, cart = [], grandTotal = 0 }) => {
  if (typeof window === 'undefined' || !orderId) return;

  const eventDeduplicationId = `purchase_${orderId}`;
  const totalValue = Number(grandTotal || 0);
  const contentIds = cart.map((i) => String(i.did || i.productDid || i.id || i.raw?.id || ''));
  const numItems = cart.reduce((acc, i) => acc + Number(i.quantity || 1), 0);

  if (isMetaLoaded && window.fbq) {
    window.fbq(
      'track',
      'Purchase',
      {
        content_name: 'Order Purchase',
        content_ids: contentIds,
        content_type: 'product',
        value: totalValue,
        currency: 'BDT',
        num_items: numItems,
        order_id: String(orderId),
      },
      { eventID: eventDeduplicationId }
    );
  }

  if (isTikTokLoaded && window.ttq) {
    window.ttq.track(
      'CompletePayment',
      {
        contents: cart.map((i) => ({
          content_id: String(i.did || i.productDid || i.id || i.raw?.id || ''),
          content_name: i.name,
          quantity: Number(i.quantity || 1),
          price: Number(i.price || 0),
        })),
        value: totalValue,
        currency: 'BDT',
        order_id: String(orderId),
      },
      { event_id: eventDeduplicationId }
    );
  }
};
