"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploaderWithFocalPoints, type ImageEntry } from "@/components/ui/ImageUploaderWithFocalPoints";
import { FocalPointPicker } from "@/components/ui/FocalPointPicker";
import Link from "next/link";
import { Save, Plus, Trash2 } from "lucide-react";

type VariantDraft = { id?: string; size: string; price: string; salePrice: string; inventoryCount: string };

export interface AdminProduct { id: string; name: string; }

export interface AdminProductDetails {
  id: string;
  name: string;
  ritualName?: string | null;
  functionalTitle?: string | null;
  texture?: string | null;
  images: string[];
  imagePositions?: any;
  faqData?: string | any;
  resonanceData?: string | any;
  variants: { id: string; size?: string | null; priceInCents: number; salePriceInCents?: number | null; inventoryCount: number }[];
  description: string;
  howToUse?: string | null;
  ingredientsText?: string | null;
  textureHeading?: string | null;
  textureScent?: string | null;
  inspirationHeading?: string | null;
  culturalInspiration?: string | null;
  performanceMedia?: string | null;
  performanceMediaPosition?: string | null;
  regimenProductIds?: string[];
  isFeaturedHair?: boolean;
  isFeaturedScent?: boolean;
}

export default function EditProductForm({
  product,
  allProducts,
  handleSubmit
}: {
  product: AdminProductDetails;
  allProducts: AdminProduct[];
  handleSubmit: (formData: FormData) => void
}) {
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>(() => {
    const urls = (product.images as string[]).filter(
      (u: string) => u && u !== "Product Image Placeholder"
    );
    const positions: string[] = Array.isArray(product.imagePositions)
      ? (product.imagePositions as string[])
      : [];
    return urls.map((url, i) => ({ url, position: positions[i] || "center" }));
  });

  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>(
    product.faqData ? (typeof product.faqData === "string" ? JSON.parse(product.faqData) : product.faqData) : []
  );

  const [resonance, setResonance] = useState<{timeframe: string, title: string, description: string}[]>(
    product.resonanceData ? (typeof product.resonanceData === "string" ? JSON.parse(product.resonanceData) : product.resonanceData) : [
      { timeframe: "Day 01", title: "", description: "" },
      { timeframe: "Day 14", title: "", description: "" },
      { timeframe: "Day 30", title: "", description: "" }
    ]
  );

  const [variants, setVariants] = useState<VariantDraft[]>(() =>
    product.variants && product.variants.length > 0
      ? product.variants.map((v: { id: string; size?: string | null; priceInCents: number; salePriceInCents?: number | null; inventoryCount: number }) => ({
          id: v.id,
          size: v.size || "",
          price: String(v.priceInCents / 100),
          salePrice: v.salePriceInCents ? String(v.salePriceInCents / 100) : "",
          inventoryCount: String(v.inventoryCount),
        }))
      : [{ size: "", price: "", salePrice: "", inventoryCount: "0" }]
  );

  function updateVariant(index: number, field: keyof VariantDraft, value: string) {
    setVariants((prev) => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  }

  function addVariant() {
    setVariants((prev) => [...prev, { size: "", price: "", salePrice: "", inventoryCount: "100" }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={handleSubmit} className="space-y-12">
      <input type="hidden" name="faqData" value={JSON.stringify(faqs)} />
      <input type="hidden" name="resonanceData" value={JSON.stringify(resonance)} />
      <input type="hidden" name="imagesJson" value={JSON.stringify(imageEntries.map((e) => e.url))} />
      <input type="hidden" name="imagePositionsJson" value={JSON.stringify(imageEntries.map((e) => e.position))} />
      <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />
      <div className="bg-cream p-8 border border-earth/10 space-y-8 shadow-sm">
        
        <div className="space-y-4">
          <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Core Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Product Name *</label>
              <Input id="name" name="name" required defaultValue={product.name} className="bg-sand border-earth/20 focus-visible:border-bronze" />
            </div>
            <div className="space-y-2">
              <label htmlFor="ritualName" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Regimen Line</label>
              <select 
                id="ritualName" 
                name="ritualName"
                defaultValue={product.ritualName || ""}
                className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth"
              >
                <option value="">Select Regimen (Optional)</option>
                <option value="The Cleansing Regimen">The Cleansing Regimen</option>
                <option value="The Restoration Regimen">The Restoration Regimen</option>
                <option value="The Growth Regimen">The Growth Regimen</option>
                <option value="The Olfactory Regimen">The Olfactory Regimen</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="functionalTitle" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Functional Subtitle</label>
              <Input id="functionalTitle" name="functionalTitle" defaultValue={product.functionalTitle || ""} className="bg-sand border-earth/20 focus-visible:border-bronze" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="texture" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Product Texture</label>
              <select 
                id="texture" 
                name="texture" 
                defaultValue={product.texture || ""}
                className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth"
              >
                <option value="">Select Texture (Optional)</option>
                <option value="Oil">Oil</option>
                <option value="Clay">Clay</option>
                <option value="Cream">Cream</option>
                <option value="Mist">Mist</option>
                <option value="Serum">Serum</option>
                <option value="Parfum">Parfum</option>
              </select>
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Product Images</label>
              <ImageUploaderWithFocalPoints entries={imageEntries} onChange={setImageEntries} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-earth/10 pb-2">
            <h2 className="text-lg font-serif text-earth">Pricing & Variants</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addVariant} className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Variant
            </Button>
          </div>
          <div className="space-y-3">
            {variants.map((v, index) => (
              <div key={index} className="p-4 border border-earth/10 bg-stone/20 relative">
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(index)} className="absolute top-3 right-3 text-earth/40 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <p className="text-[10px] font-semibold tracking-widest uppercase text-earth/60 mb-3">Variant {index + 1}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Size / Volume</label>
                    <Input value={v.size} onChange={(e) => updateVariant(index, "size", e.target.value)} placeholder="e.g. 250ml" className="bg-sand border-earth/20 focus-visible:border-bronze" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Price (₦) *</label>
                    <Input value={v.price} onChange={(e) => updateVariant(index, "price", e.target.value)} type="number" min="0" placeholder="25000" className="bg-sand border-earth/20 focus-visible:border-bronze" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-bronze">Sale Price (₦)</label>
                    <Input value={v.salePrice} onChange={(e) => updateVariant(index, "salePrice", e.target.value)} type="number" min="0" placeholder="Optional" className="bg-sand border-bronze/40 focus-visible:border-bronze" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Stock</label>
                    <Input value={v.inventoryCount} onChange={(e) => updateVariant(index, "inventoryCount", e.target.value)} type="number" min="0" placeholder="100" className="bg-sand border-earth/20 focus-visible:border-bronze" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Poetry & Storytelling</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="description" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Main Description *</label>
              <textarea 
                id="description" 
                name="description"
                required
                rows={4}
                defaultValue={product.description}
                className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="howToUse" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Usage Guide (How To)</label>
              <textarea 
                id="howToUse" 
                name="howToUse"
                rows={3}
                defaultValue={product.howToUse || ""}
                className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="ingredientsText" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Key Ingredients</label>
              <textarea 
                id="ingredientsText" 
                name="ingredientsText"
                rows={3}
                defaultValue={product.ingredientsText || ""}
                className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {/* Sensory & Cultural Narrative */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Sensory & Cultural Narrative</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sensory Section */}
                <div className="space-y-4 p-4 border border-earth/10 bg-stone/20">
                  <div className="space-y-2">
                    <label htmlFor="textureHeading" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Sensory Heading</label>
                    <Input 
                      id="textureHeading" 
                      name="textureHeading" 
                      defaultValue={product.textureHeading || "Texture & Scent"}
                      className="bg-sand border-earth/20 focus-visible:border-bronze" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="textureScent" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Sensory Description</label>
                    <textarea 
                      id="textureScent" 
                      name="textureScent"
                      rows={4}
                      defaultValue={product.textureScent || "Earthy, slightly gritty paste that transforms into a soft, non-foaming cream. Scented with vetiver and raw clay."}
                      className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Narrative Section */}
                <div className="space-y-4 p-4 border border-earth/10 bg-stone/20">
                  <div className="space-y-2">
                    <label htmlFor="inspirationHeading" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Narrative Heading</label>
                    <Input 
                      id="inspirationHeading" 
                      name="inspirationHeading" 
                      defaultValue={product.inspirationHeading || "Cultural Inspiration"}
                      className="bg-sand border-earth/20 focus-visible:border-bronze" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="culturalInspiration" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Narrative Description</label>
                    <textarea 
                      id="culturalInspiration" 
                      name="culturalInspiration"
                      rows={4}
                      defaultValue={product.culturalInspiration || "Inspired by the purifying regimens of the continent, where the earth itself is used to draw out impurities and restore balance."}
                      className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Anticipated Resonance UI */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Anticipated Resonance (Timeline)</h2>
              <div className="space-y-4">
                {resonance.map((res, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-earth/10 bg-stone/20">
                    <div className="space-y-2">
                       <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Timeframe</label>
                       <Input value={res.timeframe} onChange={(e) => {
                         const updated = [...resonance];
                         updated[index].timeframe = e.target.value;
                         setResonance(updated);
                       }} className="bg-sand border-earth/20" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Title</label>
                       <Input value={res.title} onChange={(e) => {
                         const updated = [...resonance];
                         updated[index].title = e.target.value;
                         setResonance(updated);
                       }} className="bg-sand border-earth/20" />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                       <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Description</label>
                       <textarea value={res.description} onChange={(e) => {
                         const updated = [...resonance];
                         updated[index].description = e.target.value;
                         setResonance(updated);
                       }} rows={2} className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs UI */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center border-b border-earth/10 pb-2">
                <h2 className="text-lg font-serif text-earth">Frequently Asked Questions</h2>
                <Button type="button" variant="secondary" size="sm" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}>
                  + Add FAQ
                </Button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 border border-earth/10 bg-stone/20 relative">
                    <button type="button" onClick={() => setFaqs(faqs.filter((_, i) => i !== index))} className="absolute top-2 right-2 text-earth/50 hover:text-red-500 text-xs uppercase tracking-widest font-bold">Remove</button>
                    <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Question</label>
                         <Input value={faq.question} onChange={(e) => {
                           const updated = [...faqs];
                           updated[index].question = e.target.value;
                           setFaqs(updated);
                         }} className="bg-sand border-earth/20 pr-16" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Answer</label>
                         <textarea value={faq.answer} onChange={(e) => {
                           const updated = [...faqs];
                           updated[index].answer = e.target.value;
                           setFaqs(updated);
                         }} rows={2} className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth" />
                      </div>
                    </div>
                  </div>
                ))}
                {faqs.length === 0 && <p className="text-sm text-earth/50 italic">No FAQs added yet.</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="performanceMedia" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Performance Media URL (Image or Video)</label>
              <Input 
                id="performanceMedia" 
                name="performanceMedia"
                type="url"
                defaultValue={product.performanceMedia || ""}
                placeholder="https://example.com/texture.mp4" 
                className="bg-sand border-earth/20 focus-visible:border-bronze rounded-none" 
              />
              <p className="text-[10px] text-earth/60">Provide a URL to an image or video showing the application texture.</p>
              <FocalPointPicker name="performanceMediaPosition" defaultValue={product.performanceMediaPosition || "center"} label="Performance Media Focal Point" />
            </div>
            <div className="space-y-4 mt-4">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Complete Regimen (Pairings)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-earth/20 p-6 bg-sand max-h-64 overflow-y-auto">
                {allProducts.filter((p: AdminProduct) => p.id !== product.id).map((p: AdminProduct) => (
                  <label key={p.id} className="flex items-center space-x-3 text-sm text-earth cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="regimenProductIds" 
                      value={p.id} 
                      defaultChecked={product.regimenProductIds?.includes(p.id)}
                      className="rounded-sm border-earth/30 text-earth focus:ring-earth bg-cream w-4 h-4 cursor-pointer" 
                    />
                    <span className="truncate">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Homepage Spotlight */}
      <div className="bg-cream p-8 border border-earth/10 space-y-4 shadow-sm">
        <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Homepage Spotlight</h2>
        <p className="text-[10px] text-earth/50 uppercase tracking-widest">Only one product can hold each spotlight at a time. Enabling one here will automatically remove it from any previously set product.</p>
        <div className="flex flex-col sm:flex-row gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="isFeaturedHair"
              defaultChecked={product.isFeaturedHair ?? false}
              className="h-4 w-4 border-earth/30 text-earth focus:ring-earth bg-cream rounded-sm cursor-pointer"
            />
            <span className="text-sm text-earth group-hover:text-bronze transition-colors">Feature as <strong>Hero Hair Product</strong> on homepage</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="isFeaturedScent"
              defaultChecked={product.isFeaturedScent ?? false}
              className="h-4 w-4 border-earth/30 text-earth focus:ring-earth bg-cream rounded-sm cursor-pointer"
            />
            <span className="text-sm text-earth group-hover:text-bronze transition-colors">Feature as <strong>Hero Scent Product</strong> on homepage</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
          <Link href="/admin/products">
            <Button type="button" variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">Cancel</Button>
          </Link>
          <Button type="submit" className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
      </div>
    </form>
  );
}
