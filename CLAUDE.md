# ORIGONÆ — Claude Code Project Rules

Sourced from `.agents/rules/rules.md`. Follow these at all times.

---

## 0. Project Management — Mandatory Workflow

**Before ANY Work Session (CRITICAL):**
1. Read `docs/PROJECT_STATUS.md`
2. Read `docs/TASKS.md`
3. Read `docs/KNOWN_ISSUES.md`
4. Scan `docs/CHANGELOG.md`

**After ANY Meaningful Change (CRITICAL):**
1. Update `docs/CHANGELOG.md` — log what you did.
2. Update `docs/PROJECT_STATUS.md` — change affected feature statuses.
3. Update `docs/TASKS.md` — mark done, add any discovered tasks.
4. Update `docs/KNOWN_ISSUES.md` — add new issues, remove fixed ones.

*Workflow Rule: Atomic progress. Never leave the project broken. Never skip doc updates.*

---

## 1. Project Structure

- Follow the established App Router structure: `src/app/`, `src/components/`, `src/lib/`, `src/emails/`
- Place server actions in `src/app/actions/` — one file per domain (product, order, user, etc.)
- Place reusable UI in `src/components/ui/`, layout components in `src/components/layout/`
- Place Zod schemas and validators in `src/lib/validators.ts`
- Place email templates (React Email) in `src/emails/`
- **Do not create duplicate components or pages** — check existing paths before creating new files
- Filenames: kebab-case for files, PascalCase for component names

## 2. Code Quality

- **TypeScript always** — type all props, server action returns, and data structures
- Use **Zod** for all user input validation; schemas live in `src/lib/validators.ts`
- Prefer **Tailwind CSS** — no inline styles, no CSS modules unless necessary
- No hardcoded strings for UI copy that will be user-facing
- Reuse utility functions from `src/lib/`; avoid duplicating logic

## 3. Data & API

- All Prisma queries go through the singleton in `src/lib/prisma.ts`
- Use **async/await** with try/catch in all server actions
- Never trust client-supplied prices — always validate against DB in checkout
- Store API keys and URLs in environment variables; never hardcode them
- Use `findFirst` instead of `findUnique` when using the PG adapter (avoids PANIC bug)

## 4. UI / UX

- **Responsive design** is mandatory — mobile first, then tablet, then desktop
- All images must use `next/image` with meaningful `alt` text
- Use the brand palette: `cream`, `earth`, `ink` (defined in Tailwind config)
- Typography: Cormorant Garamond (headings), Inter (body)
- Maintain consistent spacing — follow existing page layouts as reference

## 5. State Management

- **Zustand** for client-side global state (cart store, currency store)
- **NextAuth JWT session** for auth state — access via `auth()` server-side or `useSession()` client-side
- Do not store sensitive data (tokens, passwords) in localStorage or Zustand

## 6. Authentication & Authorization

- Three roles: `CUSTOMER`, `SALON`, `ADMIN`
- Protect routes in `src/middleware.ts` — do not rely on client-side guards alone
- Always call `auth()` in server actions that require authentication
- Admin actions must verify `session.user.role === "ADMIN"` before proceeding

## 7. SEO & Metadata

- Every page must export a `generateMetadata` function (or static `metadata` object)
- Include: `title`, `description`, Open Graph (`og:`), and Twitter card tags
- Use canonical URLs; avoid duplicate meta tags
- Dynamic pages (PDP, journal, ingredients) must generate metadata from DB data

## 8. Performance

- Shop and PDP routes use `export const dynamic = "force-dynamic"` — do not remove this
- Lazy-load non-critical client components
- Prefer server components; only use `"use client"` when interactivity is needed
- Do not fetch data in client components when a server component can do it

## 9. Error Handling

- All server actions must return `{ success: boolean; error?: string }` shape
- Wrap Prisma calls in try/catch; log errors server-side, return user-friendly messages client-side
- Pages must have error boundaries (`error.tsx`) and loading states (`loading.tsx`)
- Never expose stack traces or DB errors to the client

## 10. Emails

- Use **Resend** + **React Email** for all transactional emails
- Email sending functions live in `src/lib/email.ts`
- Email templates (React components) live in `src/emails/`
- All emails must be styled consistently with the brand (cream background, ink text)

## 11. Payments

- Payment processing uses **Paystack** — do not switch providers without discussion
- Webhook handler lives at `src/app/api/webhooks/paystack/route.ts`
- Always verify Paystack webhook signatures before processing events
- Never trust client-supplied payment status — verify via webhook or Paystack API

## 12. Version Control

- `main` is production — keep it stable
- Keep commits small and focused on one concern
- Do not commit `.env` or any secrets
- Run `next build` mentally — ensure no TypeScript errors before committing

## 13. AI-Specific (Claude)

- **Read existing files before editing** — never assume structure
- Check for existing components/actions before creating new ones
- Do not over-engineer — the minimum code that solves the problem is correct
- Do not add features not explicitly requested
- Follow the existing code style in whatever file you are editing
