# Engulfic Frontend — API Payload Documentation

> **Change Logging Rules:**
> - এই ফাইলে হওয়া প্রতিটা ফিক্স বা পরিবর্তনের জন্য একটি কমেন্ট লগ `E01` থেকে ক্রমান্বয়ে ইনক্রিমেন্ট হবে (`E01`, `E02`, `E03`...)।
> - সমস্ত কমেন্ট লগ ডেডিকেটেড ব্যাকলগ ফাইল [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)-এ সংরক্ষণ ও আপডেট করা হবে।

## Comment Logs

### [E18] 2026-08-18: Made Sticky Navbar Header More Compact on Scroll
- **সমস্যা:** ডেস্কটপে স্ক্রল করার পর যখন ন্যাভবারটি স্টিকি পজিশনে থাকে, তখন এটির হাইট ও আইকন সাইজ কমিয়ে আরো বেশি কমপ্যাক্ট এবং মিনিমালিস্ট করার প্রয়োজন ছিল।
- **Fix:**
  - `Navbar.jsx`-এ একটি স্ক্রল ইভেন্ট লিসেনার অ্যাড করে `isScrolled` স্টেট চালু করা হয়েছে।
  - ইউজার যখন পেজে নিচে স্ক্রল করবে (Window Y-Offset > 40px), তখন টপ টিয়ারের প্যাডিং `py-4` থেকে কমে `py-2`, লোগোর সাইজ `text-3xl` থেকে `text-xl`, এবং অ্যাকশন বাটনসমূহের প্যাডিং ও ভেতরের আইকন সাইজ যথাক্রমে `p-3` (w-5 h-5) থেকে ছোট হয়ে `p-2` (w-4 h-4) এ নেমে আসবে।
  - বটম টিয়ারের ন্যাভিগেশন লিংকগুলোর ভার্টিকাল প্যাডিং `py-3.5` থেকে সংকুচিত হয়ে `py-1.5` এ নেমে যাবে।
  - এছাড়াও ন্যাভবার থেকে পূর্বে হার্ডকোড করা "Jerseys" লিংকটি স্থায়ীভাবে রিমুভ করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/Navbar.jsx`](file:///f:/Engulfic/src/components/Navbar.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E17] 2026-08-18: Resolved Category ID Strings to Cached Display Names
- **সমস্যা:** প্রোডাক্ট ভিউ পেজ এবং রিলেটেড সেকশনের হেডারে ক্যাটাগরি নামের পরিবর্তে র (Raw) ক্যাটাগরি আইডি (যেমন: `6a7f16256cb27019830ecb99`) প্রদর্শিত হচ্ছিল।
- **Fix:**
  - `transformProduct.js`-এ ক্যাটাগরি স্ট্রিং রেজোলিউশন মডিফাই করা হয়েছে। এখন ক্যাটাগরি ভ্যালু যদি র আইডি স্ট্রিং হয়, তবে সেটি `localStorage` এ ক্যাশ করা ক্যাটাগরি লিস্ট (`luxury_categories`) থেকে মানুষের পাঠযোগ্য সঠিক ডিসপ্লে নাম এবং স্ল্যাগ রেজলভ করবে।
- **ফাইলসমূহ:**
  - [`src/lib/transformProduct.js`](file:///f:/Engulfic/src/lib/transformProduct.js)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E16] 2026-08-18: Hid Jerseys and subcategories from Navbar Menu & Bestsellers
- **সমস্যা:** নেভিগেশন মেনু (Navbar dropdowns/drawers) এবং বেস্ট সেলিং ফিল্টার ট্যাব থেকে "Jerseys" ক্যাটাগরি এবং এর সাব-ক্যাটাগরিগুলো হাইড করার প্রয়োজন ছিল।
- **Fix:**
  - `menu.json` কনফিগারেশন থেকে "Jerseys" ব্লক এবং এর সকল সাব-ক্যাটাগরি অবজেক্ট রিমুভ করা হয়েছে।
  - `BestSellingProducts.jsx` এর ট্যাব এরে থেকে "Jerseys" ক্যাটাগরি বাদ দেওয়া হয়েছে।
- **ফাইলসমূহ:**
  - [`src/lib/menu.json`](file:///f:/Engulfic/src/lib/menu.json)
  - [`src/components/BestSellingProducts.jsx`](file:///f:/Engulfic/src/components/BestSellingProducts.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E15] 2026-08-18: Fixed Mobile Carousel Product Card Clippings
- **সমস্যা:** মোবাইলে ক্যারোসেলে কার্ড রেন্ডার করার সময় কার্ডের ডান দিক ও নিচের বর্ডারের কিছু অংশ কেটে আসছিল (clipping)। তাছাড়া কার্ডে হোভার ট্রানজিশন (`hover:-translate-y-1.5`) এর কারণে স্ক্রল এরিয়াতে লে-আউট শিফট হচ্ছিল।
- **Fix:**
  - `NewArrivalsSection.jsx`-এ কার্ডের প্যাডিং অফসেট `p-2` থেকে `pr-4` এ শিফট করা হয়েছে এবং মোবাইল উইডথ `w-[70%]` করা হয়েছে যাতে কার্ডের সাইড বা শ্যাডো কেটে না যায়।
  - `ProductCard.jsx` থেকে হোভার ট্রানজিশন `hover:-translate-y-1.5` রিমুভ করা হয়েছে যাতে স্ক্রল কন্টেইনারে কার্ডের পজিশন স্ট্যাটিক থাকে এবং কাটিং না ঘটে।
- **ফাইলসমূহ:**
  - [`src/components/NewArrivalsSection.jsx`](file:///f:/Engulfic/src/components/NewArrivalsSection.jsx)
  - [`src/components/ProductCard.jsx`](file:///f:/Engulfic/src/components/ProductCard.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E14] 2026-08-17: Unified All API Calls from a Single Entrypoint (src/lib/api.js)
- **সমস্যা:** ওয়েবসাইটটিতে এপিআই রিকোয়েস্ট দুটি ভিন্ন ফাইলে ভাগ করা ছিল (`src/lib/api.js` এবং `src/core/lib/api.js`), যার ফলে ইমপোর্টগুলো ফ্র্যাগমেন্টেড হয়ে পড়ছিল।
- **Fix:**
  - পুরো ওয়েবসাইটের সকল এপিআই রিকোয়েস্টকে একটি একক উৎস `src/lib/api.js`-এ একীভূত করা হয়েছে।
  - `src/core/lib/api.js` এর সকল মেম্বারশিপ, অথেনটিকেশন, অর্ডার এবং কুপন ফাংশনসমূহকে `src/lib/api.js` থেকে রি-এক্সপোর্ট করা হয়েছে।
  - কোর এপিআই ইউজারদের সাথে সামঞ্জস্যতা বজায় রাখতে `fetchProductDetails` মেথডটিকে কাস্টম ইমপ্লিমেন্টেড `fetchProductById` এর একটি এলিয়াস (Alias) হিসেবে যুক্ত করা হয়েছে।
  - পুরো প্রজেক্টের সব ফাইল, কম্পোনেন্ট, পেজ এবং জাস্ট্যান্ড স্টোরে থাকা `core/lib/api` ইমপোর্টগুলো আপডেট করে `@/lib/api` এ রিডাইরেক্ট করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/lib/api.js`](file:///f:/Engulfic/src/lib/api.js)
  - [`src/components/ProfileModal.jsx`](file:///f:/Engulfic/src/components/ProfileModal.jsx)
  - [`src/components/SearchModal.jsx`](file:///f:/Engulfic/src/components/SearchModal.jsx)
  - [`src/core/store/useAppStore.js`](file:///f:/Engulfic/src/core/store/useAppStore.js)
  - [`src/pages/Checkout.jsx`](file:///f:/Engulfic/src/pages/Checkout.jsx)
  - [`src/pages/Product.jsx`](file:///f:/Engulfic/src/pages/Product.jsx)
  - [`src/pages/Profile.jsx`](file:///f:/Engulfic/src/pages/Profile.jsx)
  - [`src/store/useAuthStore.js`](file:///f:/Engulfic/src/store/useAuthStore.js)
  - [`src/store/useCartStore.js`](file:///f:/Engulfic/src/store/useCartStore.js)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E12] 2026-08-17: Removed Value Props Bar, Fixed Slider Pagination, Reordered Home Sections, and Refined Bestsellers Tabs
- **সমস্যা:** 
  - স্লাইডারের নিচের ভ্যালু প্রপস বারটি বাদ দেওয়ার প্রয়োজন ছিল।
  - স্লাইডারের একদম নিচের পেজিনেশন ডটগুলো কেটে যাচ্ছিল।
  - হোমপেজ সেকশনগুলো ভুল অর্ডারে সাজানো ছিল (ক্যাটাগরি আগে, নিউ অ্যারাইভাল পরে)।
  - ক্যাটাগরি হেডারটিতে "CATEGORIES & SUBCATEGORIES" লেখা ছিল, যেখানে শুধু "CATEGORIES" থাকা বাঞ্ছনীয়।
  - বেস্ট সেলিং সেকশনে ৮টির জায়গায় ৪টি প্রোডাক্ট দেখানোর কথা ছিল এবং ফাঁকা বা প্রোডাক্টহীন ক্যাটাগরি ট্যাবগুলোও সেখানে দেখা যাচ্ছিল।
- **Fix:**
  - `Home.jsx` থেকে ভ্যালু প্রপস বার সেকশনটি সরিয়ে ফেলা হয়েছে।
  - `HeroBanner.jsx`-এ উচ্চতার লিমিট ও প্যাডিং অ্যাডজাস্ট করা হয়েছে যেন পেজিনেশন ডটগুলো কখনো কেটে না যায়।
  - হোমপেজের অর্ডারিং ঠিক করা হয়েছে: `HeroBanner` -> `NewArrivalsSection` -> `CategoryGrid` -> `BestSellingProducts`।
  - `CategoryGrid.jsx` এর হেডার টেক্সট আপডেট করে শুধু "CATEGORIES" করা হয়েছে।
  - `BestSellingProducts.jsx`-এ লিমিট কমিয়ে `4` প্রোডাক্ট করা হয়েছে এবং এপিআই প্রোডাক্ট লিস্ট অ্যানালাইসিস করে প্রোডাক্টহীন ফাঁকা ক্যাটাগরি ট্যাবগুলোকে ডায়নামিকালি রিমুভ করার লজিক দেওয়া হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/BestSellingProducts.jsx`](file:///f:/Engulfic/src/components/BestSellingProducts.jsx)
  - [`src/components/CategoryGrid.jsx`](file:///f:/Engulfic/src/components/CategoryGrid.jsx)
  - [`src/components/HeroBanner.jsx`](file:///f:/Engulfic/src/components/HeroBanner.jsx)
  - [`src/pages/Home.jsx`](file:///f:/Engulfic/src/pages/Home.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E11] 2026-08-17: Fixed Rich Text Descriptions, Interactive Cursors, Badges, and Trust Features in Product View
- **সমস্যা:** 
  - প্রোডাক্ট ডেসক্রিপশনে রিচ টেক্সট এডিটর থেকে আসা `<p>` ট্যাগ টেক্সট আকারে রেন্ডার হচ্ছিল।
  - গ্লোবালি `a` এবং `button` ইত্যাদিতে কার্সার পয়েন্টার ছিল না।
  - প্রোডাক্ট পেইজে অপ্রয়োজনীয় `DID` ফিল্ড প্রদর্শিত হচ্ছিল, ক্যাটাগরি ব্যাজ ও ব্রেডক্রাম্বগুলো ক্লিকযোগ্য ছিল না (ব্রেডক্রাম্ব-এ `<Link>` এর `to` এর বদলে `href` ছিল)।
  - `longDescription` ডানদিকের ছোট প্যানেলে আঁটসাঁট হয়ে আসছিল।
  - ট্রাস্ট ব্যাজে গ্লোবাল DHL ও রিফান্ড পলিসি লেখা ছিল যা লোকাল সার্ভিসের সাথে মিলছিল না।
- **Fix:**
  - `Product.jsx` এর ডেসক্রিপশন এবং ডিটেইলড ওভারভিউতে `dangerouslySetInnerHTML` ব্যবহার করা হয়েছে।
  - `index.css`-এ গ্লোবাল রুলস যোগ করে লিংক ও বাটনসমূহে `cursor: pointer` নিশ্চিত করা হয়েছে।
  - `Product.jsx` থেকে `DID`, `season` ও `type` ব্যাজ রিমুভ করে ক্যাটাগরি ব্যাজকে ক্লিকযোগ্য ক্যাটাগরি লিংকে রূপান্তর করা হয়েছে।
  - `Breadcrumb.jsx`-এ ভুল `href` প্রপ পরিবর্তন করে সঠিক `to` প্রপ ব্যবহার করা হয়েছে।
  - `longDescription` (Detailed Overview) কে মেইন দুই কলামের লে-আউট গ্রিড থেকে বের করে নিচে ফুল-উইডথ সেকশন হিসেবে সাজানো হয়েছে।
  - ট্রাস্ট ব্যাজের আইকন ও লেখা আপডেট করে `Nationwide Delivery`, `Pure & Authentic Product` এবং `Best Customer Service` করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/Breadcrumb.jsx`](file:///f:/Engulfic/src/components/Breadcrumb.jsx)
  - [`src/index.css`](file:///f:/Engulfic/src/index.css)
  - [`src/pages/Product.jsx`](file:///f:/Engulfic/src/pages/Product.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

### [E10] 2026-08-17: Fixed Slider Height Cutoffs, Sticky Desktop Header, and Mobile Bottom Navigation Bar
- **সমস্যা:** 
  - হোম স্লাইডারে থাকা ভ্যালু প্রপস বারের কারণে স্লাইডারের উচ্চতা অসম হয়ে যাচ্ছিল এবং মোবাইলে কন্টেন্ট কেটে যাচ্ছিল।
  - ডেক্সটপে স্ক্রল করার সময় উপরের অ্যানাউন্সমেন্ট মার্কি সহ পুরো হেডার স্টিকি হয়ে থাকত।
  - মোবাইলের জন্য স্টিকি হেডারের পরিবর্তে ফুটারে একটি বটম নেভিগেশন বার প্রয়োজন ছিল।
- **Fix:**
  - `HeroBanner.jsx` থেকে ভ্যালু প্রপস বার সরিয়ে `Home.jsx` এ স্লাইডারের নিচে আলাদা কন্টেইনার সেকশনে যোগ করা হয়েছে, যা স্লাইডারের হাইট কাট-অফ ইস্যু সমাধান করে।
  - `Navbar.jsx` এর মার্কি অ্যানাউন্সমেন্ট বারকে হেডারের বাইরে নিয়ে আসা হয়েছে এবং হেডারকে রেসপন্সিভ স্টিকি করা হয়েছে (`relative lg:sticky lg:top-0`), যেন ডেক্সটপে শুধু হেডার ফিক্সড থাকে এবং মোবাইলে তা স্ক্রল হয়ে চলে যায়।
  - মোবাইলের জন্য একটি দৃষ্টিনন্দন বটম নেভিগেশন বার (`lg:hidden fixed bottom-0`) যোগ করা হয়েছে, যেখানে বামে মেনু ও শপ, মাঝে হোম বাটন এবং ডানে সার্চ ও কার্ট অ্যাকশন রয়েছে।
  - মোবাইলে বটম বারের জন্য কন্টেন্ট ঢেকে যাওয়া আটকাতে `App.jsx` এর মেইন কন্টেইনারে `pb-16 lg:pb-0` প্যাডিং যোগ করা হয়েছে।
- **ফাইলসমূহ:**
  - [`src/components/HeroBanner.jsx`](file:///f:/Engulfic/src/components/HeroBanner.jsx)
  - [`src/components/Navbar.jsx`](file:///f:/Engulfic/src/components/Navbar.jsx)
  - [`src/pages/Home.jsx`](file:///f:/Engulfic/src/pages/Home.jsx)
  - [`src/App.jsx`](file:///f:/Engulfic/src/App.jsx)
  - [`docs/api-payload-fixes.md`](file:///f:/Engulfic/docs/api-payload-fixes.md)
  - [`docs/E01-100.md`](file:///f:/Engulfic/docs/E01-100.md)

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
