# Engulfic Frontend — API Payload Documentation

> **Change Logging Rules:**
> - এই ফাইলে হওয়া প্রতিটা ফিক্স বা পরিবর্তনের জন্য একটি কমেন্ট লগ `E01` থেকে ক্রমান্বয়ে ইনক্রিমেন্ট হবে (`E01`, `E02`, `E03`...)।
> - সমস্ত কমেন্ট লগ ডেডিকেটেড ব্যাকলগ ফাইল [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)-এ সংরক্ষণ ও আপডেট করা হবে।

## Comment Logs

### [E09] 2026-08-17: Centered Bestsellers Header, Added Category Tabs & Smooth Image Hover Transitions
- **সমস্যা:** বেস্ট সেলিং প্রোডাক্টস সেকশনের হেডার টেক্সট সেন্টারে ছিল না এবং ক্যাটাগরি অনুযায়ী প্রোডাক্ট ফিল্টার করার জন্য কোনো ট্যাব ছিল না। তাছাড়া, প্রোডাক্ট কার্ডে মাউস হোভার করলে হুট করে ছবি পরিবর্তন হয়ে যেত (ফ্লিপ করত), যা দেখতে প্রীতিকর ছিল না।
- **Fix:**
  - `BestSellingProducts.jsx`-এ "BEST SELLING PRODUCTS" হেডার টেক্সট সেন্টারে অ্যালাইন করা হয়েছে।
  - ক্যাটাগরি ফিল্টারিং-এর জন্য রেসপন্সিভ ট্যাব (All, T-Shirt, Shirts, Sweatshirts, Pants, Jerseys) যোগ করা হয়েছে, যা মোবাইলে ভার্টিক্যালি এবং ডেক্সটপে হরিজন্টালি প্রদর্শিত হয়।
  - `ProductCard.jsx` এ হোভার করার সময় ছবির ঝটকা পরিবর্তন রোধ করতে দুটি ইমেজ লেয়ার করে `1200ms` ট্রানজিশন ডুরেশন সহ স্মুথ ফেড ও জুম-ইন এফেক্ট ইমপ্লিমেন্ট করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/BestSellingProducts.jsx`](file:///f:/Engulfic/src/components/BestSellingProducts.jsx)
  - [`src/components/ProductCard.jsx`](file:///f:/Engulfic/src/components/ProductCard.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E08] 2026-08-17: Fixed Carousel Container Alignment to Match Page Width
- **সমস্যা:** হোমপেজের হরিজন্টাল প্রোডাক্ট ক্যারোসেল কন্টেইনারের বাইরে চলে যাচ্ছিল (negative margins এর কারণে), যার ফলে অন্যান্য সেকশনের (যেমন: Best Selling Products) সাথে অ্যালাইনমেন্ট মিলছিল না।
- **Fix:**
  - `NewArrivalsSection.jsx` ফাইলের ক্যারোসেল লিস্ট এলিমেন্ট থেকে `-mx-*` এবং `px-*` ক্লাস রিমুভ করে স্ট্যান্ডার্ড `max-w-7xl` গ্রিড কন্টেইনারের সাথে অ্যালাইনমেন্ট সমান করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/NewArrivalsSection.jsx`](file:///f:/Engulfic/src/components/NewArrivalsSection.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E07] 2026-08-17: Removed Hardcoded Mock Customer Data & Default Orders
- **সমস্যা:** প্রোফাইল পেজ এবং জাস্ট্যান্ড স্টোরে হার্ডকোডেড ডামি কাস্টমার ইনফরমেশন (নাম, ইমেইল, অ্যাড্রেস) এবং ফেক অর্ডার হিস্ট্রি রাখা ছিল।
- **Fix:**
  - `useAuthStore.js` থেকে হার্ডকোডেড ডামি অর্ডার সরিয়ে খালি অ্যারে (`[]`) করা হয়েছে।
  - `Profile.jsx` এর স্টেট এবং রিড-অনলি ভিউ থেকে ডামি ডেটা রিমুভ করে ডাইনামিক ডেটা লোডিং এবং `useEffect` সিঙ্ক্রোনাইজেশন অ্যাড করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/pages/Profile.jsx`](file:///f:/Engulfic/src/pages/Profile.jsx)
  - [`src/store/useAuthStore.js`](file:///f:/Engulfic/src/store/useAuthStore.js)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E06] 2026-08-17: Replaced CATEGORY with SALE in On-Sale Card Badge
- **সমস্যা:** ক্যাটাগরি গ্রিডে "On Sale" কার্ডের উপরের ব্যাজে স্ট্যাটিকভাবে "CATEGORY" লেখা দেখাচ্ছিল।
- **Fix:**
  - `CategoryGrid.jsx` ফাইলে টপ ব্যাজের টেক্সটটি কন্ডিশনাল করা হয়েছে যেন ক্যাটাগরির স্ল্যাগ `sale` হলে সেখানে "SALE" লেখা প্রদর্শন করে।
- **ফাইলসমূহ:**
  - [`src/components/CategoryGrid.jsx`](file:///f:/Engulfic/src/components/CategoryGrid.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E05] 2026-08-17: Fixed Product Cards Alignment, Carousel Controls, HTML Tagline & /shop/ URLs
- **সমস্যা:** প্রোডাক্ট কার্ডের ট্যাগলাইনে র HTML ট্যাগ চলে আসছিল, কার্ডের উচ্চতা অসমান ছিল, ক্যারোসেলে স্ক্রলবার দেখা যাচ্ছিল এবং কোনো নেভিগেশন অ্যারো ছিল না। তাছাড়াও সিঙ্গেল প্রোডাক্ট ডিটেইলস এর URL পাথ `/shop/:id` হওয়া প্রয়োজন ছিল।
- **Fix:**
  - `transformProduct.js` এ ট্যাগলাইন তৈরির সময় Regex দিয়ে HTML ট্যাগ ফিল্টার/রিমুভ করা হয়েছে।
  - `ProductCard.jsx` এর সম্পূর্ণ কার্ডকে `/shop/:id` লিংকে র‍্যাপ করা হয়েছে এবং সাব-বাটনগুলোতে প্রপাগেশন বন্ধ করা হয়েছে।
  - কার্ডগুলোর হাইট ঠিক রাখতে সাইজ/কালার অপশন অংশে `min-h-[44px]` দিয়ে অ্যালাইনমেন্ট সমান করা হয়েছে।
  - `NewArrivalsSection.jsx` ক্যারোসেলে ডেক্সটপ নেভিগেশন অ্যারো এবং স্ক্রলবার হাইড করার ক্লাস যোগ করা হয়েছে।
  - `App.jsx` এ নতুন `/shop/:id` রাউট যোগ করা হয়েছে এবং সব লিঙ্ক `/product/` থেকে `/shop/` এ পরিবর্তন করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/lib/transformProduct.js`](file:///f:/Engulfic/src/lib/transformProduct.js)
  - [`src/components/ProductCard.jsx`](file:///f:/Engulfic/src/components/ProductCard.jsx)
  - [`src/components/NewArrivalsSection.jsx`](file:///f:/Engulfic/src/components/NewArrivalsSection.jsx)
  - [`src/components/SearchModal.jsx`](file:///f:/Engulfic/src/components/SearchModal.jsx)
  - [`src/pages/Cart.jsx`](file:///f:/Engulfic/src/pages/Cart.jsx)
  - [`src/App.jsx`](file:///f:/Engulfic/src/App.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E04] 2026-08-17: Adjusted Category Grid layout to 3 Columns on Large Screens
- **সমস্যা:** ক্যাটাগরি সেকশনে এক লাইনে ৪টি কলাম ছিল, যা পরিবর্তন করে প্রতি রো-তে ৩টি কলাম করার রিকোয়ারমেন্ট ছিল।
- **Fix:**
  - `CategoryGrid.jsx` ফাইলের মেইন গ্রিড এবং স্কেলেটন লোডিং গ্রিড উভয় জায়গায় `lg:grid-cols-4` পরিবর্তন করে `lg:grid-cols-3` করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/CategoryGrid.jsx`](file:///f:/Engulfic/src/components/CategoryGrid.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E03] 2026-08-17: Fixed React Child Object Crash with Raw Backend Category Objects
- **সমস্যা:** ব্যাকএন্ড থেকে আসা `category` বা `categories` পপুলেটেড অবজেক্ট হলে, তা রিঅ্যাক্ট কম্পোনেন্টে রেন্ডার করার সময় "Objects are not valid as a React child" ইরর আসছিল।
- **Fix:**
  - `resolveCategoryName` এবং `transformProduct.js`-এ অবজেক্ট ইনপুট চেক যোগ করে ক্যাটাগরির `name` এক্সট্র্যাক্ট করা হয়েছে।
  - সমস্ত ক্যাটাগরি রেন্ডার করা রিঅ্যাক্ট কম্পোনেন্টে (`ProductCard`, `QuickViewModal`, `SearchModal`, `CartDrawer`, `Cart`, `Checkout`, `Product`) সেফ চেক এবং অবজেক্ট হ্যান্ডলিং যুক্ত করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/core/store/productHelpers.js`](file:///f:/Engulfic/src/core/store/productHelpers.js)
  - [`src/lib/transformProduct.js`](file:///f:/Engulfic/src/lib/transformProduct.js)
  - [`src/lib/api.js`](file:///f:/Engulfic/src/lib/api.js)
  - [`src/components/ProductCard.jsx`](file:///f:/Engulfic/src/components/ProductCard.jsx)
  - [`src/components/QuickViewModal.jsx`](file:///f:/Engulfic/src/components/QuickViewModal.jsx)
  - [`src/components/SearchModal.jsx`](file:///f:/Engulfic/src/components/SearchModal.jsx)
  - [`src/components/CartDrawer.jsx`](file:///f:/Engulfic/src/components/CartDrawer.jsx)
  - [`src/pages/Cart.jsx`](file:///f:/Engulfic/src/pages/Cart.jsx)
  - [`src/pages/Checkout.jsx`](file:///f:/Engulfic/src/pages/Checkout.jsx)
  - [`src/pages/Product.jsx`](file:///f:/Engulfic/src/pages/Product.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E02] 2026-08-15: Enforced Required Phone Validation & Payload Formatting for Registration
- **সমস্যা:** রেজিস্ট্রেশনের সময় ফোন নাম্বার অপশনাল হিসেবে হ্যান্ডেল করা হয়েছিল এবং ক্লায়েন্ট-সাইডে ফোন নাম্বারের সঠিক ফরম্যাট ভ্যালিডেশন ছিল না।
- **Fix:**
  - `ProfileModal.jsx`-এ ফোন নাম্বারকে রিকোয়ার্ড (Required) করা হয়েছে।
  - ইউজার `017XXXXXXXX` বা `+88017XXXXXXXX` যাই ইনপুট দেউক, সাবমিটের আগে এটি স্বয়ংক্রিয়ভাবে `+8801[3-9]XXXXXXXXX` ফরম্যাটে রূপান্তর/নরমালাইজ হবে।
  - বাংলাদেশি ফোন নাম্বারের সঠিক Regex ভ্যালিডেশন চেক যোগ করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/ProfileModal.jsx`](file:///f:/Engulfic/src/components/ProfileModal.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)

### [E01] 2026-08-15: Fixed Cart, Checkout and Navigation Routing Issues
- **সমস্যা:** `<Link>` কম্পোনেন্টে ভুল করে `href` এট্রিবিউট ব্যবহার করা হয়েছিল এবং `Navbar.jsx` ফাইলে `useLocation()` সরাসরি `pathname` ভেরিয়েবলে অ্যাসাইন করা হয়েছিল (ডিস্ট্রাকচার করা হয়নি)।
- **Fix:** 
  - `Cart.jsx` ও `CategoryGrid.jsx` এ `<Link href="...">` পরিবর্তন করে `<Link to="...">` করা হয়েছে।
  - `Navbar.jsx` ফাইলে `const { pathname } = useLocation();` করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/Navbar.jsx`](file:///f:/Engulfic/src/components/Navbar.jsx)
  - [`src/components/CategoryGrid.jsx`](file:///f:/Engulfic/src/components/CategoryGrid.jsx)
  - [`src/pages/Cart.jsx`](file:///f:/Engulfic/src/pages/Cart.jsx)

---

> **Last Updated:** 2026-08-15
> **Reference:** `F:\AFull\backend\docs\api\`

এই ফাইলে frontend থেকে backend-এ কোন API-তে কী payload পাঠানো হয় তার সম্পূর্ণ ডকুমেন্টেশন আছে।

---

## 1. Member Registration

**Endpoint:** `POST /api/v1/members/register`
**Auth:** Not required
**File:** `src/components/ProfileModal.jsx` → `handleRegister()`
**API Ref:** `F:\AFull\backend\docs\api\09_Members-api.md`

### Request Payload

```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "phone": "+8801712345678",
  "password": "securePassword123"
}
```

### Field Mapping (Form → Payload)

| Payload Field | Status | Source / Notes |
|---|---|---|
| `name` | `name` state | সরাসরি |
| `email` | `email` state | সরাসরি |
| `phone` | `phone` state | `+880` prefix normalize করা হয় |
| `password` | `password` state | সরাসরি |
| `role` | হার্ডকোড | সবসময় `"Customer"` |
| `billingInfo.firstName` | `name.split(' ')[0]` | name split করা |
| `billingInfo.lastName` | `name.split(' ').slice(1)` | name split করা |
| `billingInfo.address1` | `''` (empty) | Registration-এ address নেওয়া হয় না |
| `billingInfo.country` | হার্ডকোড | সবসময় `"Bangladesh"` |

### Phone Normalization Logic

```js
const normalizedPhone = phone.startsWith('+')
  ? phone
  : `+880${phone.replace(/^0/, '')}`;
// "01712345678" → "+8801712345678"
// "+8801712345678" → "+8801712345678" (unchanged)
```

### Success Response Shape

```json
{
  "status": "success",
  "message": "An OTP to verify your account has been sent to your email.",
  "data": {
    "id": "...",
    "email": "user@example.com",
    "expiresAt": "..."
  }
}
```

---

## 2. OTP Verification (Post-Registration)

**Endpoint:** `POST /api/v1/members/verify-otp`
**File:** `src/components/ProfileModal.jsx` → `handleVerifyOtp()`
**API Ref:** `F:\AFull\backend\docs\api\09_Members-api.md`

### Request Payload

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

---

## 3. Member Login

**Endpoint:** `POST /api/v1/members/login`
**File:** `src/components/ProfileModal.jsx` → `handleLogin()`
**API Ref:** `F:\AFull\backend\docs\api\09_Members-api.md`

### Request Payload

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Success Response Shape

```json
{
  "status": "success",
  "isEmailVerified": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "phone": "...", "role": "Customer" },
    "accessToken": "jwt-access-token",
    "refreshToken": "refresh-token-string"
  }
}
```

### Token Storage

```js
// localStorage keys:
"luxury_access_token"   // accessToken
"luxury_refresh_token"  // refreshToken
```

---

## 4. Checkout — Place Order

**Endpoint:** `POST /api/v1/orders/new-order`
**Auth:** Not required
**File:** `src/pages/Checkout.jsx` → `handlePlaceOrder()`
**API Ref:** `F:\AFull\backend\docs\api\06_orders-api.md`

### Request Payload

```json
{
  "billingInfo": {
    "fullName": "Nadia Rahman",
    "phone": "+8801712345678",
    "email": "customer@example.com",
    "address": "House 12, Road 3",
    "thana": "Dhanmondi",
    "district": "Dhaka",
    "zip": "1209"
  },
  "shippingInfo": {
    "fullName": "Nadia Rahman",
    "phone": "+8801712345678",
    "address": "House 12, Road 3",
    "thana": "Dhanmondi",
    "district": "Dhaka",
    "zip": "1209"
  },
  "paymentMethod": "cod",
  "subtotal": 1200,
  "shippingFee": 100,
  "total": 1300,
  "items": [
    {
      "name": "Oud Imperial",
      "quantity": 1,
      "unitPrice": 1200,
      "size": "100ml"
    }
  ]
}
```

### Field Mapping (Form → Payload)

| Payload Field | Source | নোট |
|---|---|---|
| `billingInfo.fullName` | `billingForm.firstName + ' ' + billingForm.lastName` | merge করা |
| `billingInfo.phone` | `billingForm.phone` | সরাসরি |
| `billingInfo.email` | `billingForm.email` | সরাসরি |
| `billingInfo.address` | `billingForm.address` | সরাসরি |
| `billingInfo.thana` | `billingForm.thana` | সরাসরি |
| `billingInfo.district` | `billingForm.district` | সরাসরি |
| `shippingInfo` | `shipToDifferent ? shippingForm : billingForm` | same as billing যদি আলাদা না হয় |
| `paymentMethod` | হার্ডকোড | সবসময় `"cod"` (lowercase) |
| `subtotal` | `getSubtotal()` | cart store থেকে |
| `shippingFee` | `getCalculatedShipping().cost` | district/thana ভিত্তিক |
| `total` | `subtotal - discount + shippingFee` | grand total |
| `items[].unitPrice` | `cart[].price` | `price` নয়, `unitPrice` |

### Shipping Fee Logic

| District | Thana | Fee |
|---|---|---|
| Dhaka | Savar | ৳ 100 |
| Dhaka | Other | ৳ 70 |
| Other | Any | ৳ 120 |
| Empty cart | — | ৳ 0 |

### Success Response — Order ID

```js
// API returns: response.data.orderNumber (e.g. "ORD-20260815-123456")
const generatedId = response.data?.orderNumber || response.orderNumber || fallback;
```

### Success Response Shape

```json
{
  "status": "success",
  "message": "Order received successfully",
  "data": {
    "id": "...",
    "orderNumber": "ORD-20260815-123456",
    "status": "processing"
  }
}
```

---

## 5. Update Member Profile

**Endpoint:** `PUT /api/v1/members/:memberId`
**Auth:** Required (Bearer token)
**File:** `src/pages/Profile.jsx` → `handleSaveProfile()`
**API Ref:** `F:\AFull\backend\docs\api\09_Members-api.md`

### Request Payload

```json
{
  "name": "Updated Name",
  "phone": "+8801XXXXXXXXX",
  "billingInfo": {
    "firstName": "Updated",
    "lastName": "Name",
    "address1": "House 42, Road 11",
    "city": "Dhaka",
    "postcode": "1213",
    "phone": "+8801XXXXXXXXX"
  },
  "shippingInfo": {
    /* same as billingInfo */
  }
}
```

---

## Fix History

| Date | File | সমস্যা | Fix |
|---|---|---|---|
| 2026-08-15 | `ProfileModal.jsx` | `role`, `billingInfo`, `shippingInfo` missing; phone format wrong | Added all fields, phone normalize |
| 2026-08-15 | `Checkout.jsx` | `billingAddress` → `billingInfo`, `price` → `unitPrice`, `totalAmount` → `total`, `COD` → `cod`, wrong orderId field | All field names corrected |
| 2026-08-15 | `Checkout.jsx` | Billing/Shipping form-এ hardcoded dummy data | সব empty string করা হয়েছে |
