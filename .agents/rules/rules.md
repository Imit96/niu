---
trigger: always_on
---

# AI-Powered IDE Ruleset for Cosmetics Website

## 1. Project Structure Rules

* Always follow a **modular file structure**:

  * `components/` → Reusable UI components
  * `pages/` → Next.js route pages
  * `styles/` → Global and modular CSS
  * `public/` → Static assets (images, icons, fonts)
  * `lib/` → Utility functions
  * `hooks/` → Custom React hooks
  * `services/` → API calls or external integrations
* **Do not create duplicate components or pages**; check existing names and paths.
* All filenames and component names must be **kebab-case or PascalCase consistently**.

## 2. Code Quality & Consistency

* Always enforce **TypeScript types** and interfaces for all props and data structures.
* Use **ESLint + Prettier** rules to maintain consistent formatting.
* Avoid inline CSS; prefer **TailwindCSS** or CSS modules.
* Avoid **duplicate logic**; reuse functions from `lib/` or `services/` wherever possible.
* All hooks and utility functions must be **pure and reusable**.

## 3. Data & API Handling

* All API calls must:

  * Use **async/await**
  * Handle **errors gracefully** and display fallback UI.
  * Validate response data against **TypeScript interfaces**.
* Never hardcode URLs; store **API endpoints in environment variables** (`.env`).
* Avoid redundant data fetching; implement **caching strategies** where possible.
* Validate that **data is consistent** across pages (e.g., product info is the same on `/shop` and `/product/[id]`).

## 4. UI / UX Rules

* Ensure **responsive design** across devices (mobile, tablet, desktop).
* Avoid **duplicate components** with same functionality.
* Maintain **consistent spacing, typography, and color schemes**.
* All images must have:

  * **Alt text**
  * Optimized size (prefer **next/image** for automatic optimization)
* Avoid overlapping interactive elements or misaligned layouts.

## 5. State Management

* Use **React Context** or **Zustand** for global state.
* Do not duplicate state logic in multiple components.
* Ensure state updates **do not cause unnecessary re-renders**.
* Persist user data only when necessary; do not store sensitive information locally.

## 6. Routing & Navigation

* Ensure **all links use Next.js `<Link>`** for client-side routing.
* Avoid broken routes; validate existence before linking.
* Maintain **consistent URL naming conventions** (kebab-case, lowercase).
* Dynamic routes must have **fallbacks** and **404 handling**.

## 7. SEO & Metadata

* Each page must have:

  * Unique `<title>` and `<meta description>`
  * Open Graph (`og:`) and Twitter card metadata
* Avoid duplicate meta tags across pages.
* Ensure **canonical URLs** to prevent SEO issues.

## 8. Internationalization (i18n)

* Use **Next.js i18n routing** or similar library.
* Never hardcode strings; all text must go through **translation files**.
* Ensure **RTL/LTR support** if required in future.

## 9. Performance & Optimization

* Avoid large bundles; implement **code-splitting**.
* Lazy-load non-critical components.
* Optimize all images (WebP preferred) and fonts.
* Remove unused code and assets.
* Validate **page load times** using Lighthouse standards.

## 10. Error Handling & Logging

* All unexpected errors must:

  * Be caught with try/catch
  * Log detailed information (without exposing sensitive info)
  * Show **user-friendly messages** instead of breaking the UI
* Avoid swallowing errors silently.

## 11. Testing

* Write **unit tests** for components and functions (e.g., Jest + React Testing Library)
* Write **integration tests** for key flows (checkout, sign-up)
* Avoid deploying untested code.
* All tests must pass before committing.

## 12. Version Control & CI/CD

* Enforce **Git branching rules**: `main` for production, `dev` for features.
* Avoid merge conflicts by keeping commits small and atomic.
* Automate **linting, formatting, and test running** on CI.
* Tag releases and keep a **changelog**.

## 13. AI-Specific Instructions

* **Check existing components, styles, and utilities before generating new ones.**
* Do not create components with **identical UI/UX purpose** unless intentional variants.
* Always validate:

  * Naming consistency
  * Correct file structure
  * Type safety
  * Duplicate assets or icons
* Prioritize **reusability and scalability** over generating new elements.
* Avoid writing hardcoded strings; always use localization functions.

## 14. Icon & Asset Rules

* Use **FontAwesome + Heroicons** (or similar) for icons.
* Do not duplicate icons; check if the required icon already exists.
* All assets must be **compressed** and named consistently.
