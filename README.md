# .bbr — Winter Sport Gear E-Commerce

> **⚠️ PRODUCTION READINESS AUDIT: SCORE 12/100 — NOT PRODUCTION READY**
>
> This codebase is a **prototype/demo**. The full audit is below. Do NOT deploy to production without addressing every critical and high-severity issue.

---

## Audit Summary

| Metric | Score |
|--------|-------|
| **Production Readiness** | **12/100** |
| **Security** | **18/100** |
| **Performance** | **55/100** |
| **Code Quality** | **35/100** |
| **Maintainability** | **30/100** |

Can this safely serve 10,000 users? **ABSOLUTELY NOT.** The current architecture has zero persistence (in-memory store), zero concurrency control, zero stock management, and exposes unauthenticated payment creation. Even 10 concurrent users would expose race conditions. 10,000 users would result in catastrophic data loss, overselling by orders of magnitude, and payment integrity failures.

---

## Must Fix Before Deployment

1. **Replace in-memory order store with a real database** (Prisma/Drizzle/Supabase)
2. **Implement stock tracking** with atomic decrement/increment
3. **Fix duplicate product slugs** (all 5 products share slug `"yourproduct"`)
4. **Add authentication to the payment creation API endpoint** or remove the public route
5. **Implement webhook idempotency** (prevent double-payment processing)
6. **Rotate all committed API keys** (`.env.local` is in git history)
7. **Add security headers** (HSTS, CSP, X-Frame-Options, etc.)
8. **Add idempotency key** to checkout server actions (prevent double-click checkout)
9. **Fix timing-attack-vulnerable webhook token verification** (use `crypto.timingSafeEqual`)
10. **Add error boundaries** and custom 404 pages (`error.tsx`, `not-found.tsx`)
11. **Add structured logging** for all payment, webhook, and error events
12. **Set production environment variables** — `NEXT_PUBLIC_APP_URL` must point to real domain, `XENDIT_MODE=live`
13. **Fix `featuredBannerPanels` undefined import** in `featured-banner.tsx`
14. **Add foreign keys, transactions, and indexes** when implementing the database

---

## Complete Audit Report

- [1. Critical Issues](#1-critical-issues)
- [2. High Severity Issues](#2-high-severity-issues)
- [3. Medium Severity Issues](#3-medium-severity-issues)
- [4. Low Severity Issues](#4-low-severity-issues)
- [5. Edge Case Analysis](#5-edge-case-analysis)

---

### 1. Critical Issues

#### 1.1 No Database — In-Memory Store Only

- **Severity:** Critical
- **Category:** Database
- **File:** `src/lib/orders/store.ts:7`
- **Problem:** Orders are stored in a `Map<string, Order>` in Node.js process memory. On server restart (deploy, scale, cold start), ALL orders are lost. Different server instances have different maps.
- **Why dangerous:** 100% data loss on restart. Cannot serve more than one concurrent instance.
- **How to reproduce:** Deploy to Vercel, create an order, wait for idle, revisit — order is gone.
- **Fix:** Add Prisma/Drizzle/Supabase with PostgreSQL immediately.

#### 1.2 No Authentication on Payment Creation Endpoint

- **Severity:** Critical
- **Category:** Security
- **File:** `src/app/api/payment/create/route.ts:1-61`
- **Problem:** `POST /api/payment/create` has zero authentication. Anyone can create invoices with arbitrary amounts and customer data.
- **Why dangerous:** Attacker can create unlimited invoices for fraud, DDoS against Xendit, or social engineering.
- **How to reproduce:** `curl -X POST https://site.com/api/payment/create -H "Content-Type: application/json" -d '{"externalId":"hack-1","amount":99999999,"payerEmail":"x@x.com","customer":{"given_names":"x","email":"x@x.com"},"items":[{"name":"x","quantity":1,"price":99999999}],"successRedirectUrl":"https://x.com","failureRedirectUrl":"https://x.com","description":"x"}'`
- **Fix:** Remove the REST endpoint entirely (server actions already handle checkout securely) or add CSRF-protected authentication.

#### 1.3 No Database Transactions or Foreign Keys

- **Severity:** Critical
- **Category:** Database/Payment
- **File:** `src/lib/orders/store.ts` (entire file)
- **Problem:** No referential integrity, no transactions, no atomic operations. Stock checking and order creation are not atomic.
- **Why dangerous:** Concurrent checkouts oversell inventory. Payment webhooks race with order actions. Data is permanently inconsistent.
- **Fix:** Use PostgreSQL with foreign keys, `SERIALIZABLE` or `REPEATABLE READ` transactions, and pessimistic stock locks.

#### 1.4 No Stock Deduction Anywhere

- **Severity:** Critical
- **Category:** Database/Payment
- **File:** `src/actions/checkout.ts:67-121` and `src/lib/products/types.ts` (entire file)
- **Problem:** `processCheckout` checks `isSizeAvailable` but NEVER deducts stock. The `Product` type has no stock field.
- **Why dangerous:** Infinite overselling. 1,000 users can buy the same "last item."
- **Fix:** Add stock quantity to the database, decrement on order creation, increment on cancellation/expiry.

#### 1.5 Duplicate Product Slugs — 80% of Catalog Unreachable

- **Severity:** Critical
- **Category:** Code Quality
- **File:** `src/data/products.ts:8,19,30,41,52`
- **Problem:** ALL 5 products have `slug: "yourproduct"`. `getProductBySlug` uses `Array.find()` — only the first match is returned. 4 of 5 products are unreachable.
- **Why dangerous:** All product links go to the same page (goggles). Broken shop.
- **Fix:** Give every product a unique slug.

#### 1.6 Webhook Not Idempotent — Double Payment Risk

- **Severity:** Critical
- **Category:** Payment
- **File:** `src/app/api/webhook/xendit/route.ts:36-48`
- **Problem:** Xendit may retry webhooks. No idempotency check on webhook event IDs. Duplicate webhooks are silently accepted.
- **Why dangerous:** Double processing of payment callbacks. Order status can be overwritten by stale webhook retries.
- **Fix:** Store processed webhook event IDs and reject duplicates with 409.

---

### 2. High Severity Issues

#### 2.1 Webhook Token Verification Timing Attack

- **Severity:** High
- **Category:** Security
- **File:** `src/lib/xendit/client.ts:91-96`
- **Problem:** `verifyWebhookToken` uses `header === webhookToken` — a string comparison vulnerable to timing attacks.
- **Why dangerous:** Attacker can brute-force the webhook token character-by-character using response timing.
- **Fix:** Use `crypto.timingSafeEqual()` from Node.js `crypto` module.

#### 2.2 No Rate Limiting on Any Endpoint

- **Severity:** High
- **Category:** Security/Production
- **File:** All API routes
- **Problem:** No rate limiting on payment creation, checkout actions, or webhook endpoints.
- **Why dangerous:** Attacker can brute-force webhook tokens, spam payment creation, or DDoS the Xendit API via your server.
- **Fix:** Add `express-rate-limit` or Next.js middleware with rate limiting (e.g., `@upstash/ratelimit`).

#### 2.3 API Key Leaked in `.env.local` (Committed to Git)

- **Severity:** High
- **Category:** Security
- **File:** `.env.local:4-8`
- **Problem:** Xendit test secret key, public key, and webhook token are in `.env.local` which is committed to git.
- **Why dangerous:** Anyone with repo access has full Xendit test API control. Test keys can sometimes access production data if misconfigured.
- **Fix:** Rotate keys immediately. Add `.env.local` to `.gitignore`. Run `git rm --cached .env.local` to remove from tracking. Use environment variable dashboard on deployment platform.

#### 2.4 No Security Headers

- **Severity:** High
- **Category:** Production/Security
- **File:** `next.config.ts:1-4`
- **Problem:** No HSTS, CSP, X-Frame-Options, X-Content-Type-Options, or any security headers configured.
- **Why dangerous:** Vulnerable to clickjacking, MIME-sniffing attacks, no HTTPS enforcement.
- **Fix:** Configure `async headers()` in `next.config.ts` with all standard security headers.

#### 2.5 Webhook Race Condition

- **Severity:** High
- **Category:** Payment
- **File:** `src/app/api/webhook/xendit/route.ts:49-58`
- **Problem:** `getOrderByExternalId` checks status, then `updateOrderByExternalId` writes — but two concurrent webhooks can both pass the guard.
- **Why dangerous:** Stale status overwrites. Order marked PAID then immediately overwritten to EXPIRED by a racing webhook.
- **Fix:** Use database-level atomic operations: `UPDATE orders SET status = 'PAID' WHERE external_id = $1 AND status IN ('PENDING')`.

#### 2.6 Checkout Form Data Exposed in Failure Redirect URL

- **Severity:** High
- **Category:** Security/Privacy
- **File:** `src/actions/checkout.ts:168`
- **Problem:** Failure redirect URL contains plaintext `productSlug` and `size` in query parameters. Not URL-encoded.
- **Why dangerous:** Privacy leak via referrer headers. URL breaks if slugs contain special characters.
- **Fix:** Use `encodeURIComponent()` and/or store checkout context server-side.

#### 2.7 No Structured Logging or Error Tracking

- **Severity:** High
- **Category:** Production
- **File:** Entire project
- **Problem:** Zero logging infrastructure. No Sentry, no Datadog, no structured logs. Only a single `console.log` in the newsletter handler.
- **Why dangerous:** Production outages, payment failures, and webhook errors are invisible. No way to debug or alert.
- **Fix:** Add Sentry for error tracking and `pino`/`winston` for structured logging with correlation IDs.

---

### 3. Medium Severity Issues

| # | Issue | File | Line | Fix |
|---|-------|------|------|-----|
| 3.1 | Cart checkout sends client-controlled items via hidden input — attacker can submit items not in their cart | `cart-checkout-form.tsx` | 56-67 | Read cart from server-side session, not form data |
| 3.2 | Order amount not validated against server-side cart in cart checkout | `actions/checkout.ts` | 172-216 | Validate amount matches server-calculated total |
| 3.3 | No CSRF token on server actions beyond baked-in Next.js protection | `actions/checkout.ts` | 124-216 | Ensure actions are never exposed via API routes |
| 3.4 | `XenditInvoiceStatus` missing "SETTLED" in `mapXenditStatus` | `actions/checkout.ts` | 33-37 | Add `isPaidStatus(status) => "PAID"` to handle both PAID and SETTLED |
| 3.5 | No custom 404, error boundary, or error pages | `src/app/` (no files exist) | — | Add `not-found.tsx` and `error.tsx` |
| 3.6 | Newsletter form submits to `#` with no feedback | `components/layout/site-footer.tsx` | 80-99 | Add actual API endpoint and loading/success states |
| 3.7 | `toUpperCase()` is locale-sensitive (Turkish "i" bug) | `product-info-tabs.tsx` | 80 | Use `.toLocaleUpperCase('en-US')` |
| 3.8 | `NEXT_PUBLIC_APP_URL` defaults to `http://localhost:3000` | `actions/checkout.ts` | 29-31 | Add validation that throws in production if localhost |
| 3.9 | `readOnly` on hidden input has no effect | `cart-checkout-form.tsx` | 67 | Remove redundant attribute |

---

### 4. Low Severity Issues

| # | Issue | File | Line | Severity |
|---|-------|------|------|----------|
| 4.1 | `Field` component duplicated in `checkout-form.tsx` and `cart-checkout-form.tsx` | Both checkout form files | 175, 189 | Low |
| 4.2 | `toUpperCopy()` is unnecessary wrapper around `.toUpperCase()` | `product-info-tabs.tsx` | 79-81 | Low |
| 4.3 | `featuredBannerPanels` imported but never exported — `featured-banner.tsx` will crash | `assets.ts` / `featured-banner.tsx` | 1 | Low |
| 4.4 | Unused `.otf` font files in `src/assets/fonts/` (Google Fonts used instead) | `src/assets/fonts/` | All | Low |
| 4.5 | `generateStaticParams` generates all pages at build — won't scale | `shop/[slug]/page.tsx` | 12-14 | Low |
| 4.6 | No `test`, `typecheck`, or CI/CD scripts | `package.json` | — | Low |
| 4.7 | No Open Graph meta tags on product pages | `shop/[slug]/page.tsx` | 16-21 | Low |
| 4.8 | Product images have no explicit `loading` attribute | `product-grid.tsx` | — | Low |

---

### 5. Edge Case Analysis

| Edge Case | Handled? | Risk |
|-----------|----------|------|
| User clicks checkout twice | **NO** — `isPending` disables button, but server action could fire twice | Medium |
| Refresh during payment | **NO** — No session state. Success page shows "order not found" if sync hasn't run yet | Medium |
| Internet disconnect during checkout | **NO** — `useActionState` has no network error handling | Medium |
| Duplicate order (same externalId) | **YES** — `externalId` uses `Date.now() + randomUUID` — high uniqueness | Low |
| Empty cart checkout | **YES** — Zod validates `items.length >= 1` | Low |
| Stock becomes zero mid-checkout | **NO** — No stock tracking exists | **Critical** |
| Admin deletes product while customer checks out | **YES** — `getProductBySlug` returns undefined → error shown to user | Low |
| Double webhook from Xendit | **NO** — No idempotency key stored | **High** |
| Fake/malicious webhook | **PARTIAL** — Token checked, but timing-vulnerable comparison | High |
| Payment expired while user is on Xendit page | **PARTIAL** — `syncOrderPaymentStatus` checks Xendit API on success page | Medium |
| User navigates back from Xendit payment page | **PARTIAL** — `failureRedirectUrl` triggers `markOrderCancelledIfPending` | Medium |
| Attacker calls payment API directly | **NO** — Public endpoint, no auth | **Critical** |
| Server restart during active checkout | **NO** — In-memory store loses all pending orders | **Critical** |

---

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router)
- **UI:** React 19.2.4, Tailwind CSS v4, Framer Motion
- **Payment:** Xendit (QRIS, e-wallet, Virtual Account, Credit Card — hosted checkout)
- **Validation:** Zod v4
- **State:** In-memory Map (MUST REPLACE)
- **Icons:** Lucide React
- **Fonts:** Inter, Pinyon Script (Google Fonts)

## Getting Started

```bash
npm install
cp .env.example .env.local   # Fill in your Xendit test keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

*Audit generated 2026-07-09. Full audit by Senior QA/Security/DevOps Engineer.*