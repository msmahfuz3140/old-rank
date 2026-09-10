# Project Context: Ultra-Premium E-Commerce Platform (Shop Genie Next)

## 1. Executive Summary
This project is an ultra-premium, production-grade Bangladeshi E-Commerce Marketplace and Direct-to-Consumer (D2C) web application inspired by `demo1.scaleuper.com`, re-engineered with a cutting-edge modern technology stack:
- **Frontend:** Next.js (App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, Zustand)
- **Backend:** Express.js (Node.js, TypeScript, Clean Architecture, RESTful APIs)
- **Authentication:** Better Auth (Session management, Role-based Access Control: Admin, Seller, Customer, OTP support)
- **Database:** MongoDB with Mongoose (Flexible schema design for products, variants, orders, incomplete orders, coupons, vendors)

---

## 2. Core Business & Architectural Highlights

### A. High-Converting Checkout & Sales Recovery Engine
1. **One-Page Fast Checkout (`/checkout`):**
   - Single-screen checkout optimized for mobile and desktop.
   - Minimal friction: Name, 11-digit Mobile Number, Delivery Location, Full Address, and Order Note.
2. **Real-time Incomplete Order / Abandoned Cart Capture:**
   - As soon as a user inputs their phone number and name in the checkout form, a debounced background POST request stores the lead as an "Incomplete Order".
   - Enables admins to follow up with dropped-off leads via WhatsApp/Phone call.
3. **Dynamic Shipping Calculation:**
   - Division -> District selection dynamically calculates delivery charges (e.g. Inside Dhaka ৳60, Outside Dhaka ৳120).
   - Free shipping rules for digital items or specific cart thresholds.
4. **Checkout OTP Verification (Optional/Toggleable):**
   - Verification code sent to the customer's phone before order submission to prevent fake/spam orders.
5. **Coupon & Discount Engine:**
   - Instant coupon code verification and deduction from subtotal.

---

### B. Comprehensive Payment System
1. **Cash on Delivery (COD):**
   - Default payment method for Bangladesh e-commerce.
2. **Manual MFS Payment (Personal Wallet Transfer):**
   - **bKash Personal:** Step-by-step instructions, recipient wallet number, Transaction ID (TrxID) input & sender number input.
   - **Nagad Personal:** Instruction guide, wallet number, TrxID & sender number.
   - **Rocket Personal:** Instruction guide, wallet number, TrxID & sender number.
3. **Automated Payment Gateways:**
   - **bKash Automated Gateway:** Direct checkout redirect / pop-up, webhook/callback payment verification.
   - **Nagad Automated Gateway:** Direct API payment initiation and callback handling.
   - **Card Payment Gateway (Visa/Mastercard/Amex/Internet Banking):** Unified payment gateway adapter architecture (compatible with SSLCommerz, aamarPay, or ShurjoPay).

---

### C. Advanced Marketing & Conversion Popups
1. **Promotional Banner Modal (`popShopModal`):**
   - Displays 2 seconds after page entry with rich graphics and CTA link.
   - Controlled via `localStorage` to repeat only once every 3 hours.
2. **Social Proof Live Sales Ticker (`snx-popup`):**
   - Toasts in bottom-left corner showing recent customer purchases (Customer Name, Product thumbnail, Time elapsed, "🛡️ Verified Order" badge).
   - Rotates dynamically from recent orders or curated notifications.
3. **Special Notice Marquee / News Ticker (`newsTickerBar`):**
   - Top banner with high-contrast alert badge and smooth marquee scrolling text, dismissible with session memory.
4. **Product Quick View Modal:**
   - Instant variant selection, color swatch preview, and "Buy Now" without navigating away from catalog.

---

### D. Multi-Vendor Marketplace & Order Tracking
1. **Multi-Vendor Architecture (`/sellers`, `/shop/[slug]`):**
   - Verified shop badges, vendor banners, logos, review ratings, and vendor-specific catalogs.
2. **Order Tracking System (`/order-track`):**
   - Visual milestone progress bar (Order Placed -> Verified -> Dispatched -> Out for Delivery -> Delivered).
   - Instant lookup by Mobile Number or Invoice ID.

---

## 3. Directory Layout

```
├── ecomerse-demo-backend/
│   ├── src/
│   │   ├── config/             # DB, Better Auth, environment variables
│   │   ├── models/             # Mongoose schemas (User, Product, Order, IncompleteOrder, etc.)
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Payment gateways, email/sms, business logic
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Auth, role check, error handler
│   │   └── server.ts           # Express app entry point
│   ├── package.json
│   └── tsconfig.json
│
├── ecomerse-demo-frontend/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (shop)/             # Catalog, Product Detail, Cart, Checkout, Order Track
│   │   ├── (auth)/             # Login, Register, Forgot Password
│   │   ├── shop/[slug]/        # Seller Shop Page
│   │   └── layout.tsx & globals.css
│   ├── components/             # Reusable UI components (Popups, CartDrawer, CheckoutForm, etc.)
│   ├── lib/                    # API client, Zustand stores, helpers
│   └── package.json
```
