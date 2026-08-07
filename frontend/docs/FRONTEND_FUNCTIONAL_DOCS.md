# Original SaaS Platform Frontend (`frontend/`) Core Architecture & Functional Documentation

This document provides a comprehensive breakdown of the core infrastructure, state management, storage, API integrations, and utility functions of the original SaaS platform frontend (`frontend/`). This documentation serves as a complete functional reference guide to facilitate smooth TypeScript conversion and integration into the new Next.js client (`new/`).

---

## 1. Overall System Architecture & Environment Setup

* **Framework & Build System:** Vite + React (SPA architecture).
* **Base Domain / Deployment:** Frontend runs on `https://decantrebd.com` (Dev Port `8001`).
* **API Root Endpoint:** Configured dynamically via `import.meta.env.VITE_API_URL` or `NEXT_PUBLIC_API_URL` (Defaults to `https://server.decantrebd.com`).
* **Media & Upload Host:** Dynamic image resolving via `import.meta.env.VITE_IMAGE_BASE_URL` (Defaults to `https://server.decantrebd.com`).
* **Routing System:** `react-router-dom` based SPA routing.

---

## 2. Storage Setup & Token Management

The application handles persistent local storage for cart, wishlist, category/brand caches, and user authentication tokens using standard browser `localStorage`.

### LocalStorage Keys Reference:

| Key Name | Purpose / Content Description | Data Type | Managed By |
| :--- | :--- | :--- | :--- |
| `luxury_access_token` | Member JWT Bearer Access Token | `String` | `api.js` (`setStoredMemberTokens`) |
| `luxury_refresh_token` | Member JWT Refresh Token for session renewal | `String` | `api.js` (`setStoredMemberTokens`) |
| `luxury_cart` | Local shopping cart items (products, variants, quantity, selected attributes) | `JSON Array` | `useAppStore.js` & `localStorage` sync |
| `luxury_wishlist` | Bookmarked/favorited product IDs or objects | `JSON Array` | `useAppStore.js` |
| `luxury_user` | Cached User Profile / Session Payload (`user.raw`) | `JSON Object` | `useAppStore.js` |
| `luxury_categories` | Cached product categories list to eliminate redundant queries | `JSON Array` | `productHelpers.js` & `useAppStore.js` |
| `luxury_brands` | Cached brands dataset for lookup normalization | `JSON Array` | `productHelpers.js` & `useAppStore.js` |

---

## 3. API Communication Layer (`src/core/lib/api.js`)

All server interactions go through centralized fetch handlers featuring timeout control, automatic retries with exponential backoff, Bearer token injection, and auto-refresh mechanisms for expired sessions (401 response handling).

### Core Transport Utilities:

1. **`getApiBaseUrl()`**: Sanitizes and returns the target API root URL from environment variables without trailing slashes.
2. **`getImageBaseUrl()`**: Resolves absolute image paths for uploads.
3. **`fetchWithTimeout(url, options, timeout = 10000)`**: Executes standard `fetch` with an `AbortController` signal to prevent hung HTTP requests.
4. **`fetchWithRetry(url, options, timeout, maxAttempts = 3)`**: Wraps `fetchWithTimeout` in a retry loop with exponential delay (`250ms * attempt`).
5. **`authFetch(url, options, timeout)`**: Interceptor wrapper that attaches the `Authorization: Bearer <luxury_access_token>` header. If a `401 Unauthorized` status is received, it attempts `refreshMemberSession()`. Upon success, it retries the original request; upon failure, it clears storage tokens and redirects the user to log in.

---

### Complete API Functions Catalog:

#### A. Product Catalog & Taxonomy API
* **`fetchProducts(opts)`**
  * **Endpoint:** `GET /api/v1/products`
  * **QueryParams:** `skip`, `limit`, `sortBy`, `order`, `q` (search string), `category`, `brand`, `season`, `tags`, `filter`, `min_price`, `max_price`, `slug`, `did`.
  * **Logic:** Fetches remote products, runs them through `mapRemoteProduct()`, attaches metadata (`_meta`, `_totalRows`), and returns normalized products.
* **`fetchProductDetails(slugOrId)`**
  * **Endpoint:** `GET /api/v1/products/:slugOrId` (Fallback: `GET /api/wp/products/:slugOrId`)
  * **Returns:** Single normalized product object.
* **`fetchCategories(opts)`**
  * **Endpoint:** `GET /api/v1/categories?skip=...&limit=...`
  * **Returns:** Array of raw category objects.
* **`fetchBrands(opts)`**
  * **Endpoint:** `GET /api/v1/brands?skip=...&limit=...`
  * **Returns:** Array of raw brand objects.
* **`fetchCombos(opts)`**
  * **Endpoint:** Fallback category query across `Combo`, `Bundle`, `Combo Set`.
  * **Returns:** List of bundled products.

#### B. Checkout & Orders API
* **`createOrder(orderPayload)`**
  * **Endpoint:** `POST /api/v1/orders/new-order`
  * **Payload Structure:**
    ```json
    {
      "items": [{ "product": "ID", "quantity": 1, "size": "100ml", "price": 1200 }],
      "shippingAddress": { "fullName": "...", "phone": "...", "address": "...", "district": "...", "thana": "..." },
      "paymentMethod": "cod",
      "shippingFee": 80,
      "promoCode": "DISCOUNT10"
    }
    ```
* **`fetchCouponByCode(code)`**
  * **Endpoint:** `GET /api/v1/coupons/:code`
  * **Returns:** Coupon details (discount percentage/flat rate, validity, minimum purchase).

#### C. Authentication & Member Management API (`/api/v1/members`)
* **`checkMemberEmail(emailPayload)`** -> `POST /api/v1/members/check-email`: Validates whether an email is registered or verified.
* **`loginMember(credentials)`** -> `POST /api/v1/members/login`: Authenticates user with email/password or OTP credentials.
* **`registerMember(memberPayload)`** -> `POST /api/v1/members/register`: Triggers user registration flow.
* **`verifyMemberOtp(payload)`** -> `POST /api/v1/members/verify-otp`: Validates 6-digit OTP codes sent via email/SMS.
* **`resendMemberOtp(payload)`** -> `POST /api/v1/members/resend-otp`: Manually requests a new OTP code.
* **`forgotMemberPassword(payload)`** -> `POST /api/v1/members/forgot-password`: Requests password reset tokens.
* **`resetMemberPassword(payload)`** -> `POST /api/v1/members/reset-password`: Sets a new password with reset tokens.
* **`refreshMemberToken(payload)`** -> `POST /api/v1/members/refresh-token`: Exchanges refresh token for new access tokens.
* **`logoutMember(payload)`** -> `POST /api/v1/members/logout`: Invalidates session on server.

#### D. Authenticated User Profile Actions
* **`fetchMembers()`** -> `GET /api/v1/members` (Auth required)
* **`fetchMemberById(memberId)`** -> `GET /api/v1/members/:id` (Auth required)
* **`createMember(memberPayload)`** -> `POST /api/v1/members` (Auth required)
* **`updateMember(memberId, updatePayload)`** -> `PUT /api/v1/members/:id` (Auth required)
* **`deleteMember(memberId)`** -> `DELETE /api/v1/members/:id` (Auth required)

---

## 4. State Management (`src/core/store/useAppStore.js`)

State management is built on **Zustand**. It centralizes UI state, product caches, user authentication, cart calculations, and checkout validation.

### Key Store Modules & Logic:

1. **Cart Operations (`cart`):**
   * `addToCart(product, quantity, size, concentration)`: Adds or updates quantity for matching product ID + variant attributes. Saves state to `localStorage.getItem('luxury_cart')`.
   * `removeFromCart(cartItemId)`: Deletes an item from the cart array.
   * `updateCartQuantity(cartItemId, newQty)`: Updates quantity.
   * `clearCart()`: Flushes cart and syncs with `localStorage`.
   * **`getCartPricing()`**: Computes `subtotal`, dynamic `shippingFee` based on location rules (Dhaka Metro = ৳80, Dhaka Suburbs = ৳100, Outside Dhaka = ৳120), `discountAmount`, and `grandTotal`.

2. **User Authentication & Profile State (`user`):**
   * `setUser(userData)`: Stores user profile object in Zustand & `localStorage` (`luxury_user`).
   * `logout()`: Clears `luxury_user`, `luxury_access_token`, `luxury_refresh_token`, resets user state to `null`.
   * `openAuthModal(mode)`: Controls modal state (`login`, `register`, `forgot-password`, `otp-verify`).

3. **Wishlist Operations (`wishlist`):**
   * `toggleWishlist(product)`: Adds/removes items from wishlist array and syncs with `localStorage.getItem('luxury_wishlist')`.

4. **Checkout & Coupon Flow:**
   * `applyCoupon(code)`: Queries `fetchCouponByCode`, validates minimum spend thresholds, and sets `appliedDiscount`.
   * `submitCheckoutOrder()`: Prepares order payload, calls `apiCreateOrder`, handles error sanitization, flushes cart on success, and returns order confirmation.

---

## 5. Utility Functions & Helper Catalog

### A. Product Transformation Helpers (`src/core/store/productHelpers.js`)

* **`mapRemoteProduct(rawProduct)`**: Normalizes raw backend MongoDB/WordPress product schemas into a predictable, clean frontend object model:
  * Fixes image URLs (`normalizeProductImage`).
  * Normalizes price tiers (`price`, `salePrice`, `regularPrice`).
  * Maps category IDs/slugs to human-readable names (`resolveCategoryName`).
  * Maps brand IDs/slugs to human-readable names (`resolveBrandName`).
  * Formats badge tags (`normalizeProductBadges`).
  * Normalizes variant attributes (sizes, decant volumes, concentrations).
* **`normalizeProductImage(rawImage)`**: Replaces legacy backend image domains (e.g. `webiste.decantrebd.com`), changes `/content/` paths to `/uploads/`, and attaches API host base URLs to relative file paths.
* **`resolveCategoryName(catValue)`**: Searches `luxury_categories` local storage cache to resolve category IDs to display titles.
* **`resolveBrandName(brandValue)`**: Searches `luxury_brands` local storage cache to resolve brand IDs to brand display names.
* **`normalizeProductBadges(product)`**: Extracts badge metadata or dynamically generates `"BESTSELLER"` or `"DECANTRE CHOICE"` badges based on flags.

### B. Regional & Address Utilities (`src/core/lib/districts.js`)

* **`BANGLADESH_DISTRICTS`**: Alphabetically sorted array of Bangladesh districts.
* **`DHAKA_SUBURBS`**: List of locations categorized under Dhaka Suburbs (e.g., Savar, Dhamrai, Keraniganj, Gazipur, Narayanganj).
* **`getThanasByDistrict(districtName)`**: Returns an array of available Thanas/Upazilas for a selected District to build autocomplete dropdowns during checkout.

### C. Styling & Theme Utilities (`src/utils/theme.js`)

* **`themes`**: Contains design tokens for **Luxury Dark** and **Luxury Light** modes, including background colors (`bg-[#050505]`), container backgrounds, typography classes, border colors (`border-[#C5A059]/25`), and pre-formatted button variance classes (`primary`, `secondary`, `outline`, `ghost`).

---

## 6. Guidelines for TypeScript Migration (`new/`)

When porting these functionalities to the new Next.js client (`new/`):
1. **Type Definitions (`.ts` / `.d.ts`):**
   * Create `types/product.ts` defining `Product`, `ProductVariant`, `Badge`, `Category`, `Brand`.
   * Create `types/user.ts` defining `User`, `MemberProfile`, `Address`, `AuthTokenBundle`.
   * Create `types/order.ts` defining `OrderPayload`, `OrderResponse`, `OrderItem`.
2. **API Layer (`lib/api.ts`):**
   * Convert `api.js` into typed async functions with defined return types `Promise<T>`.
   * Ensure `authFetch` correctly interfaces with Next.js environment variables (`NEXT_PUBLIC_API_URL`).
3. **Zustand Store Refactoring (`store/`):**
   * Split `useAppStore.js` into modular typed Zustand stores (`useAuthStore`, `useCartStore`, `useFilterStore`, `useWishlistStore`) as structured in `new/store`.
