# Engulfic Frontend — API Payload Documentation

> **Change Logging Rules:**
> - এই ফাইলে হওয়া প্রতিটা ফিক্স বা পরিবর্তনের জন্য একটি কমেন্ট লগ `E01` থেকে ক্রমান্বয়ে ইনক্রিমেন্ট হবে (`E01`, `E02`, `E03`...)।
> - সমস্ত কমেন্ট লগ ডেডিকেটেড ব্যাকলগ ফাইল [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)-এ সংরক্ষণ ও আপডেট করা হবে।

## Comment Logs

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
| `name` | Required | `name` state (trimmed) |
| `email` | Required | `email` state (trimmed) |
| `password` | Required | `password` state (min 6 chars) |
| `phone` | Required | Enforced as required on frontend & normalized to `+8801[3-9]XXXXXXXXX` format |
| `role` | Not sent | Backend defaults to `"Customer"` automatically |
| `billingInfo` | Not sent | Optional field; collected during Checkout or Profile update |
| `shippingInfo` | Not sent | Optional field; collected during Checkout or Profile update |

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
