# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Initialized `shadcn/ui` with brand colors mapped to generic CSS variables in `globals.css`.
- Enforced strict project scaffolding `/src/components/{ui,layout,shared}`.
- Replaced ambiguous `any` types with explicit interfaces in `HomeClient`, `journal/page.tsx`, and Admin product dashboard.
- Initialized strict project management workflow (`/docs/` directory).
- Integrated `lenis` smooth scrolling via a layout-level `SmoothScroll` Wrapper.
- Stripped all 'dark mode' logic from UI theme per final aesthetic decision.
- Refactored `HomeClient`, `ContactPage`, and `LoginPage` clients into Server Components with isolated interactive leaf nodes.
- Officially closed Phase 3 (Core E-commerce). Refactored `src/app/account/page.tsx` into a strict server component, extracting state into `ProfileSettingsClient.tsx` leaf node.
- **Phase 4**: Added `Ingredient` and `Guide` Prisma models; migrated DB and seeded 6 ingredients and 4 guides via Supabase.
- Created `src/app/actions/content.ts` server actions for fetching editorial content.
- Rewrote `ingredients/page.tsx` and `guides/page.tsx` to serve live DB data instead of hard-coded arrays.
- Applied `StaggerSection`, `FadeUpDiv`, and `FadeUpSection` Motion wrappers to About, Journal, Ingredients, and Guides pages for editorial-grade scroll-triggered animations.
- **Phase 5**: Applied Motion layer to Salon landing page, Salon wholesale dashboard product grid, FAQ, and Shipping pages.
- Fixed brand name typo ('Originæ' → 'ORIGONÆ') in FAQ and Shipping pages.
- Refactored Shipping page to use a data array pattern (consistent with other content pages).
- **Phase 6**: Created `HomeNewsletterSection.tsx` — a premium, full-width editorial newsletter capture with decorative vertical strokes.
- Injected newsletter section as section 9 between Reviews and Salon CTA on the homepage.
- Applied `FadeUpSection` and `StaggerSection` Motion to Ingredient Spotlight (sec 5), Reviews (sec 8), and Salon CTA (sec 10) on the homepage.
- Fixed all remaining brand name alt text typos (`Origenæ` → `ORIGONÆ`) on the homepage.
- **Phase 7**: Upgraded `GoogleAnalytics.tsx` to fire `gtag('config')` on every SPA route change via `usePathname` + `useSearchParams`.
- Upgraded `MetaPixel.tsx` to re-fire `fbq('track', 'PageView')` on every client-side navigation via `usePathname`.
- Switched `/shop` listing page from `force-dynamic` to `revalidate = 1800` (30-min ISR).
- Documented `force-dynamic` on product detail page as intentional (auth-dependent per-user state).
- Updated `PROJECT_STATUS.md` to reflect Phases 1–6 complete and Phase 7 In Progress.
- **Admin CMS — Ingredients & Guides**: Created `content-admin.ts` with full CRUD server actions (create/update/delete/fetch) for Ingredient and Guide models.
- Built `/admin/ingredients` index, new, and edit admin pages with full form fields and inline delete.
- Built `/admin/guides` index, new, and edit admin pages with full form fields and inline delete.
- Created `Textarea.tsx` UI component following the established Input component pattern.
- Updated admin sidebar layout to include Ingredients (FlaskConical) and Care Guides (BookMarked) nav links.
- **Admin CMS — Ritual Bundles**: Created `bundle-admin.ts` server actions for full bundle CRUD.
- Built `/admin/bundles` index, new, and edit pages with a scrollable product checklist (checkbox multi-select).
- Edit page uses Prisma `set` to atomically replace the product relation on save.
- Added Ritual Bundles (Layers icon) to admin sidebar.
