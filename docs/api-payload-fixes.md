# Engulfic Frontend — API Payload Documentation

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
  "phone": "+8801XXXXXXXXX",
  "password": "securePassword123",
  "role": "Customer",
  "billingInfo": {
    "firstName": "Full",
    "lastName": "Name",
    "email": "user@example.com",
    "phone": "+8801XXXXXXXXX",
    "address1": "",
    "address2": "",
    "city": "",
    "district": "",
    "state": "",
    "postcode": "",
    "country": "Bangladesh",
    "company": ""
  },
  "shippingInfo": {
    /* billingInfo এর মতোই */
  }
}
```

### Field Mapping (Form → Payload)

| Payload Field | Form State | নোট |
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
