# PROJECT TECH STACK SPECIFICATION
## Luxury Ritual-Based Haircare Brand (International-Ready)

This document defines the REQUIRED technology stack and architectural decisions for the project.  
The AI building this system MUST strictly follow this stack unless explicitly instructed otherwise.

---

# 1. CORE PRINCIPLES

- Low recurring cost
- No heavy third-party SaaS ecommerce platforms
- Full ownership of infrastructure
- Scalable internationally
- Optimized for performance and SEO
- Compatible with Next.js App Router
- Production-grade structure
- Clean luxury UI performance

---

# 2. FRONTEND STACK

## Framework
- Next.js (App Router)
- React Server Components enabled
- TypeScript (strict mode ON)

## Rendering Strategy
- Static Generation (SSG) for:
  - Homepage
  - Product pages
  - Journal/blog pages
- ISR (Incremental Static Regeneration) for product updates
- Dynamic rendering ONLY for:
  - Cart
  - Checkout
  - Account dashboard
  - Salon portal

## Styling
- TailwindCSS
- Use CSS variables for brand tokens:
  - --earth
  - --clay
  - --sand
  - --obsidian
  - --gold-muted

## Animation
- Framer Motion
- Use subtle luxury motion:
  - Slow opacity fades
  - Soft parallax
  - Smooth transitions

---

# 3. ICON STACK (REQUIRED)

Primary Icon Library:
- Lucide React

Reason:
- Lightweight
- Tree-shakeable
- Clean luxury aesthetic
- Works natively with Next.js

Optional (Editorial / Ritual Section):
- Phosphor Icons (only if stylistically required)

DO NOT use:
- FontAwesome (too heavy)
- Material Icons (not aligned with luxury aesthetic)

---

# 4. BACKEND ARCHITECTURE

## Runtime
- Next.js Route Handlers (App Router)
- Node.js runtime (NOT Edge for payments)

## API Structure
/app/api/
  /auth
  /products
  /cart
  /checkout
  /orders
  /webhooks
  /salon
  /admin

All business logic must live in:
- /lib/server/

---

# 5. DATABASE

## Engine
- PostgreSQL

## ORM
- Prisma

## Schema Core Models

- User
- Product
- ProductVariant
- Order
- OrderItem
- Inventory
- SalonPartner
- BulkPricingTier
- DiscountCode
- Review
- ContentBlock
- RitualBundle

All pricing stored in smallest currency unit (e.g., kobo, cents).

Multi-currency support required:
- NGN
- USD
- GBP
- EUR (future-ready)

---

# 6. AUTHENTICATION

Library:
- Auth.js (NextAuth)

Providers:
- Email (magic link)
- Google (optional)

Session Strategy:
- Database sessions (PostgreSQL)

Roles:
- CUSTOMER
- SALON
- ADMIN

---

# 7. PAYMENTS (INTERNATIONAL READY)

Primary (Nigeria):
- Paystack

Secondary (International Expansion):
- Stripe (when needed globally)

Implementation Rules:
- Always verify via webhook
- Never trust client-side payment status
- Create order BEFORE redirecting to payment gateway
- Update order AFTER webhook confirmation

---

# 8. STORAGE

## Media Storage
- S3-compatible storage (Cloudflare R2 preferred)
- Public product images
- Private admin uploads

Images must be:
- WebP or AVIF
- Optimized
- Lazy-loaded using Next/Image

---

# 9. ADMIN DASHBOARD

Route:
- /admin

Protected by:
- Role-based middleware

Features:
- Product CRUD
- Inventory management
- Salon approval
- Order processing
- Content editing
- Discount management

NO third-party admin dashboards.

---

# 10. SALON WHOLESALE SYSTEM

Features:
- Tier-based pricing
- Bulk minimum quantities
- Separate salon login
- Wholesale-only dashboard

Salon accounts must be:
- Manually approved by admin
- Assigned pricing tier

---

# 11. INTERNATIONALIZATION

Use:
- next-intl

Prepare for:
- Multi-currency
- Multi-language (future)
- International shipping logic

All currency formatting must be dynamic.

---

# 12. ANALYTICS

- Google Analytics 4
- Meta Pixel
- Server-side tracking where possible

DO NOT embed heavy marketing scripts globally.
Load conditionally.

---

# 13. SECURITY

Required:
- CSRF protection
- Rate limiting middleware
- Secure HTTP-only cookies
- Environment variable validation
- Webhook signature verification

---

# 14. INFRASTRUCTURE

Frontend Hosting:
- Vercel

Database Hosting:
- Railway OR Neon OR Render

DNS + CDN:
- Cloudflare

Environment Variables:
- Strict separation between development and production

---

# 15. PROJECT STRUCTURE

/app
/components
/lib
  /server
  /utils
  /validators
/prisma
/public
/styles
/types
/middleware.ts

All business logic must NOT live inside components.

---

# 16. FUTURE SCALING PATH

When traffic increases:

- Add Redis (caching layer)
- Introduce background job processing (BullMQ)
- Separate payment microservice if needed
- Enable edge caching for product pages

---

# 17. DESIGN REQUIREMENTS

Aesthetic:
- Warm earth tones
- Ritualistic luxury
- Editorial layout sections
- Minimal UI clutter

Performance Target:
- Lighthouse 90+ minimum
- TTFB under 500ms
- LCP under 2.5s

---

# FINAL DIRECTIVE TO AI

This project MUST:
- Avoid Shopify
- Avoid heavy SaaS ecommerce tools
- Use Next.js as the core framework
- Maintain full ownership of commerce logic
- Be architected for international expansion from day one

All architectural decisions must follow this document unless explicitly overridden.