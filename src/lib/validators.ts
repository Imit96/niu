import { z } from "zod";

// ==========================================
// Auth
// ==========================================

export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ==========================================
// Checkout / Orders
// ==========================================

export const CheckoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

// ==========================================
// Products
// ==========================================

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  ritualName: z.string().optional(),
  functionalTitle: z.string().optional(),
  texture: z.string().optional(),
  howToUse: z.string().optional(),
  ingredientsText: z.string().optional(),
  performanceMedia: z.string().optional(),
  textureHeading: z.string().optional(),
  textureScent: z.string().optional(),
  inspirationHeading: z.string().optional(),
  culturalInspiration: z.string().optional(),
  images: z.string().optional(),
});

export const VariantSchema = z.object({
  id: z.string().optional(),
  size: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().min(0).optional()
  ),
  inventoryCount: z.coerce.number().int().min(0).default(0),
});

// ==========================================
// Salon Application
// ==========================================

export const SalonApplicationSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  instagramHandle: z.string().optional(),
  socialMediaLinks: z.string().optional(),
  message: z.string().optional(),
});

// ==========================================
// Discount Codes
// ==========================================

export const DiscountCodeSchema = z.object({
  code: z.string().min(1, "Discount code is required").toUpperCase(),
  discountPct: z.coerce.number().min(0).max(100).optional(),
  discountFixed: z.coerce.number().min(0).optional(),
  expiresAt: z.string().optional(),
  allowedForSalon: z.boolean().default(true),
});

// ==========================================
// Flash Sales
// ==========================================

export const FlashSaleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  discountPct: z.coerce.number().min(0).max(100).optional(),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().min(1, "End date is required"),
  allowedForSalon: z.boolean().default(true),
});

// ==========================================
// Articles
// ==========================================

export const ArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().optional(),
  isFeatured: z.coerce.boolean().default(false),
  relatedProductId: z.string().optional(),
});

// ==========================================
// Contact
// ==========================================

export const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  inquiryType: z.enum(["order", "product", "press", "wholesale", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// ==========================================
// Shipping Rates
// ==========================================

export const ShippingRateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["domestic", "international"]),
  region: z.string().optional(),
  rateAmount: z.coerce.number().min(0, "Rate must be 0 or greater"),
  estimatedDays: z.string().optional(),
});

// ==========================================
// Newsletter
// ==========================================

export const NewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// ==========================================
// Password Reset
// ==========================================

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ==========================================
// Helpers
// ==========================================

/** Extract FormData into a plain object for Zod parsing */
export function formDataToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    obj[key] = value.toString();
  });
  return obj;
}
