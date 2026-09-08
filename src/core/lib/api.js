export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "https://server.engulfic.com";
  return envUrl ? envUrl.replace(/\/$/, "") : "https://server.engulfic.com";
};

export const getImageBaseUrl = () => {
  const envImgUrl = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
  return envImgUrl ? envImgUrl.replace(/\/$/, "") : getApiBaseUrl();
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStoredMemberTokens = () => {
  return {
    accessToken: localStorage.getItem("luxury_access_token"),
    refreshToken: localStorage.getItem("luxury_refresh_token")
  };
};

export const clearStoredMemberTokens = () => {
  localStorage.removeItem("luxury_access_token");
  localStorage.removeItem("luxury_refresh_token");
  localStorage.removeItem("luxury_user");
};

export const setStoredMemberTokens = (access, refresh) => {
  if (access) localStorage.setItem("luxury_access_token", access);
  if (refresh) localStorage.setItem("luxury_refresh_token", refresh);
};

const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

const fetchWithRetry = async (url, options = {}, timeout = 10000, maxAttempts = 3, attempt = 1) => {
  try {
    return await fetchWithTimeout(url, options, timeout);
  } catch (err) {
    if (attempt >= maxAttempts) throw err;
    await delay(250 * attempt);
    return fetchWithRetry(url, options, timeout, maxAttempts, attempt + 1);
  }
};

export async function refreshMemberSession() {
  const { refreshToken } = getStoredMemberTokens();
  if (!refreshToken) throw new Error("No refresh token available");
  
  const res = await refreshMemberToken({ refreshToken });
  if (res?.data) {
    setStoredMemberTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  }
  throw new Error("Refresh failed");
}

export const authFetch = async (url, options = {}, timeout = 10000) => {
  const { accessToken } = getStoredMemberTokens();
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetchWithRetry(url, { ...options, headers }, timeout, 3);

  if (res.status === 401) {
    try {
      const refreshed = await refreshMemberSession();
      const retryHeaders = new Headers(options.headers || {});
      retryHeaders.set("Authorization", `Bearer ${refreshed.accessToken}`);
      
      if (options.body && !(options.body instanceof FormData) && !retryHeaders.has("Content-Type")) {
        retryHeaders.set("Content-Type", "application/json");
      }

      res = await fetchWithRetry(url, { ...options, headers: retryHeaders }, timeout, 3);
    } catch (_) {
      clearStoredMemberTokens();
      throw new Error("Your session has expired. Please log in again.");
    }
  }
  return res;
};

// ---------------------------------------------------------
// PRODUCTS API
// ---------------------------------------------------------

import { mapRemoteProduct } from "../store/productHelpers";

export async function fetchProducts(opts = {}) {
  const apiBaseUrl = getApiBaseUrl();
  const skip = opts.skip ?? opts.offset ?? 0;
  const limit = Math.min(opts.limit || 20, 100);
  const sortBy = opts.sortBy || "createdAt";
  const order = opts.order || "desc";
  const q = opts.q || opts.search || opts.keyword || "";

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (opts.category && opts.category !== 'All' && opts.category !== 'all') {
    params.set("category", opts.category);
  }
  // Removed brand support as requested
  if (opts.season) params.set("season", opts.season);
  if (opts.tags) params.set("tags", opts.tags);
  if (opts.filter) params.set("filter", opts.filter);
  if (opts.name) params.set("name", opts.name);
  if (opts.slug) params.set("slug", opts.slug);
  if (opts.did) params.set("did", opts.did);
  if (opts.minPrice !== undefined) params.set("min_price", opts.minPrice);
  if (opts.maxPrice !== undefined) params.set("max_price", opts.maxPrice);

  params.set("skip", String(skip));
  params.set("limit", String(limit));
  params.set("sortBy", sortBy);
  params.set("order", order);

  try {
    const res = await fetchWithRetry(`${apiBaseUrl}/api/v1/products?${params.toString()}`, { method: "GET" }, 10000, 3);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];

    const mapped = list.map(mapRemoteProduct);
    mapped._meta = json.meta || null;
    mapped._totalRows = json.meta?.total_products ?? json.totalRows ?? mapped.length;
    return mapped;
  } catch (err) {
    console.error("fetchProducts Error:", err);
    throw err;
  }
}

export async function fetchProductDetails(slugOrId) {
  const apiBaseUrl = getApiBaseUrl();
  try {
    let res = await fetchWithRetry(`${apiBaseUrl}/api/v1/products/${slugOrId}`, {}, 8000, 3);
    if (!res.ok) {
      res = await fetchWithRetry(`${apiBaseUrl}/api/wp/products/${slugOrId}`, {}, 8000, 3);
    }
    if (!res.ok) throw new Error("Failed to fetch product details.");
    
    const json = await res.json();
    const targetData = json.data || json;
    return targetData && typeof targetData === "object" ? mapRemoteProduct(targetData) : null;
  } catch (err) {
    console.error("fetchProductDetails Error:", err);
    throw err;
  }
}

export async function fetchCombos(opts = {}) {
  const limit = opts.limit || 100;
  const categoryNames = ["Combo", "Bundle", "Combo Set"];
  for (const cat of categoryNames) {
    try {
      const results = await fetchProducts({ category: cat, skip: 0, limit });
      if (results && results.length > 0) return results;
    } catch (_) {}
  }
  return [];
}

// ---------------------------------------------------------
// CATEGORIES API
// ---------------------------------------------------------

export async function fetchCategories(opts = {}) {
  const apiBaseUrl = getApiBaseUrl();
  const skip = opts.skip ?? 0;
  const limit = opts.limit || 50;
  try {
    const res = await fetchWithRetry(`${apiBaseUrl}/api/v1/categories?skip=${skip}&limit=${limit}`, {}, 8000, 3);
    if (!res.ok) throw new Error("Failed to fetch categories.");
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
  } catch (err) {
    console.error("fetchCategories Error:", err);
    throw err;
  }
}

// ---------------------------------------------------------
// COUPONS & ORDERS API
// ---------------------------------------------------------

export async function fetchCouponByCode(code) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetchWithRetry(`${apiBaseUrl}/api/v1/coupons/${encodeURIComponent(code)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || json?.error || "Invalid coupon code.");
  return json?.data || json;
}

export async function createOrder(orderPayload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/orders/new-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg = json?.errors?.join(", ") || json?.message || "Failed to place order";
    throw new Error(errorMsg);
  }
  return json;
}

// ---------------------------------------------------------
// MEMBER AUTHENTICATION API
// ---------------------------------------------------------

export async function checkMemberEmail(emailPayload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emailPayload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Email check failed.");
  }
  return json;
}

export async function loginMember(credentials) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Login failed.");
  }
  return json;
}

export async function registerMember(memberPayload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memberPayload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Registration failed.");
  }
  return json;
}

export async function verifyMemberOtp(payload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "OTP verification failed.");
  return json;
}

export async function resendMemberOtp(payload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Failed to resend OTP.");
  return json;
}

export async function forgotMemberPassword(payload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Password reset request failed.");
  return json;
}

export async function resetMemberPassword(payload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Password reset failed.");
  return json;
}

export async function refreshMemberToken(payload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Token refresh failed.");
  return json;
}

export async function logoutMember(payload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/v1/members/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Logout failed.");
  return json;
}

// ---------------------------------------------------------
// MEMBERS ADMINISTRATION API (Protected)
// ---------------------------------------------------------

export async function fetchMembers() {
  const apiBaseUrl = getApiBaseUrl();
  const res = await authFetch(`${apiBaseUrl}/api/v1/members`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Failed to fetch members list.");
  return json?.data || (Array.isArray(json) ? json : []);
}

export async function fetchMemberById(memberId) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await authFetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Member not found.");
  return json?.data || json;
}

export async function createMember(memberPayload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await authFetch(`${apiBaseUrl}/api/v1/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memberPayload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Failed to create member.");
  return json?.data || json;
}

export async function updateMember(memberId, updatePayload) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await authFetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Failed to update member.");
  return json?.data || json;
}

export async function deleteMember(memberId) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await authFetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Failed to delete member.");
  return json;
}
