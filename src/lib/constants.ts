// ==========================================
// Global Application Constants
// ==========================================

// Roles
export const ROLES = {
  CUSTOMER: "CUSTOMER",
  SALON: "SALON",
  ADMIN: "ADMIN",
} as const;

// Currency
export const DEFAULT_CURRENCY = "NGN";
export const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR"] as const;

// Inventory
export const LOW_STOCK_THRESHOLD = 5; // Show "Only X left" below this count

// Order
export const ORDER_REF_PREFIX = "ord_";

// Pagination
export const REVIEWS_PAGE_SIZE = 6;
export const ORDERS_PAGE_SIZE = 10;
export const PRODUCTS_PAGE_SIZE = 24;

// Email
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@origonae.com";
export const CARE_EMAIL = process.env.CARE_EMAIL ?? "hello@origonae.com";
export const EMAIL_FROM_NAME = "ORIGONÆ";

// Site
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://origonae.com";

// Password reset
export const PASSWORD_RESET_EXPIRY_HOURS = 2;

// Nigerian states (36 states + FCT)
export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;
