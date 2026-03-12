import { getAdminSettings, updateAdminSettings } from "../../actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Settings, Save } from "lucide-react";
import { redirect } from "next/navigation";
import { SettingsSavedToast } from "./SettingsSavedToast";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  async function handleSave(formData: FormData) {
    "use server";
    const updated: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        updated[key] = value;
      }
    }
    await updateAdminSettings(updated);
    redirect("/admin/settings?saved=1");
  }

  return (
    <div className="space-y-10 max-w-4xl">
      <SettingsSavedToast />
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Settings
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Manage site-wide configuration and business details.
        </p>
      </div>

      <form action={handleSave} className="space-y-8">
        {/* Business Information */}
        <div className="bg-cream border border-earth/10 p-6 space-y-6">
          <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2 flex items-center gap-2">
            <Settings className="h-5 w-5 text-bronze" />
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="businessName"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Business Name
              </label>
              <Input
                id="businessName"
                name="businessName"
                defaultValue={settings.businessName || "ORIGONÆ"}
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="contactEmail"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Contact Email
              </label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={settings.contactEmail || ""}
                placeholder="hello@origonae.com"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="contactPhone"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Contact Phone
              </label>
              <Input
                id="contactPhone"
                name="contactPhone"
                defaultValue={settings.contactPhone || ""}
                placeholder="+234..."
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="businessAddress"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Business Address
              </label>
              <Input
                id="businessAddress"
                name="businessAddress"
                defaultValue={settings.businessAddress || ""}
                placeholder="Lagos, Nigeria"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-cream border border-earth/10 p-6 space-y-6">
          <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">
            Shipping & Delivery
          </h2>
          <div className="bg-sand border border-earth/10 px-4 py-3 text-sm text-earth/70 flex items-center justify-between">
            <span>Per-state and international shipping rates are managed separately.</span>
            <a href="/admin/shipping-rates" className="text-bronze hover:text-earth text-xs uppercase tracking-widest transition-colors font-semibold">
              Manage Rates →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="freeShippingThreshold"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Free Shipping Threshold (₦)
              </label>
              <Input
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                type="number"
                defaultValue={settings.freeShippingThreshold || ""}
                placeholder="e.g. 50000 — orders above this get free shipping"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="shippingNote"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Checkout Shipping Note
              </label>
              <textarea
                id="shippingNote"
                name="shippingNote"
                rows={2}
                defaultValue={settings.shippingNote || ""}
                placeholder="e.g. Estimated delivery: 2-5 business days within Nigeria."
                className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-cream border border-earth/10 p-6 space-y-6">
          <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">
            Social Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="instagramUrl"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Instagram URL
              </label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={settings.instagramUrl || ""}
                placeholder="https://instagram.com/origonae"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="facebookUrl"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Facebook URL
              </label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={settings.facebookUrl || ""}
                placeholder="https://facebook.com/origonae"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="tiktokUrl"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                TikTok URL
              </label>
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                defaultValue={settings.tiktokUrl || ""}
                placeholder="https://tiktok.com/@origonae"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="pinterestUrl"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Pinterest URL
              </label>
              <Input
                id="pinterestUrl"
                name="pinterestUrl"
                defaultValue={settings.pinterestUrl || ""}
                placeholder="https://pinterest.com/origonae"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="twitterUrl"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Twitter / X URL
              </label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                defaultValue={settings.twitterUrl || ""}
                placeholder="https://x.com/origonae"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="youtubeUrl"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                YouTube URL
              </label>
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                defaultValue={settings.youtubeUrl || ""}
                placeholder="https://youtube.com/@origonae"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="whatsappNumber"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                WhatsApp Support Number
              </label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                defaultValue={settings.whatsappNumber || ""}
                placeholder="+2348000000000"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
          </div>
        </div>

        {/* SEO & Metadata */}
        <div className="bg-cream border border-earth/10 p-6 space-y-6">
          <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">
            SEO & Metadata
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="siteTitle"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Site Title
              </label>
              <Input
                id="siteTitle"
                name="siteTitle"
                defaultValue={settings.siteTitle || ""}
                placeholder="ORIGONÆ — Luxury Heritage Haircare"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="siteDescription"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Default Meta Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                rows={3}
                defaultValue={settings.siteDescription || ""}
                placeholder="Luxury regimen haircare rooted in African heritage. Earthy, modern, and intentional."
                className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
