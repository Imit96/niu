import { createBundle } from "../../../actions/bundle-admin";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SingleImageUploader } from "@/components/ui/SingleImageUploader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New Bundle | Admin — ORIGONÆ" };

export default async function NewBundlePage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, functionalTitle: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/bundles" className="text-earth/50 hover:text-earth transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">New Ritual Bundle</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">Curate a product bundle for the /bundles page.</p>
        </div>
      </div>

      <form action={createBundle} className="bg-cream border border-earth/10 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Bundle Name *</label>
            <Input name="name" required placeholder="e.g. The Restoration Ritual" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Slug *</label>
            <Input name="slug" required placeholder="e.g. restoration-ritual" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Description *</label>
          <Textarea name="description" required rows={4} placeholder="Editorial description of this curated bundle..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Bundle Name (FR)</label>
          <Input name="nameFr" placeholder="Nom du coffret en francais" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Description (FR)</label>
          <Textarea name="descriptionFr" rows={4} placeholder="Description en francais..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Bundle Price (₦) *</label>
          <Input name="price" type="number" step="0.01" min="0" required placeholder="e.g. 45000" />
          <p className="text-[10px] text-earth/50">Enter the full amount in Naira — e.g. 45000 for ₦45,000</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Bundle Category *</label>
          <select 
            name="category" 
            required 
            className="flex h-10 w-full rounded-md border border-ash bg-stone px-3 py-2 text-sm ring-offset-background placeholder:text-ink/60 focus-visible:outline-none focus-visible:border-bronze focus-visible:ring-1 focus-visible:ring-bronze disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer"
          >
            <option value="HAIR">Hair Care</option>
            <option value="BODY">Skin Care</option>
            <option value="SCENT">Perfumes (Scent)</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Bundle Image</label>
          <SingleImageUploader name="image" positionName="imagePosition" />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Include Products *</label>
          <p className="text-[10px] text-earth/50">Select all regimens that form part of this bundle.</p>
          <div className="space-y-2 max-h-72 overflow-y-auto border border-earth/10 p-3">
            {products.map((product: { id: string; name: string; functionalTitle: string | null }) => (
              <label key={product.id} className="flex items-start gap-3 p-3 hover:bg-stone/30 cursor-pointer transition-colors rounded-sm">
                <input
                  type="checkbox"
                  name="productIds"
                  value={product.id}
                  className="mt-0.5 accent-earth h-4 w-4 shrink-0"
                />
                <div>
                  <p className="text-sm text-earth font-medium">{product.name}</p>
                  {product.functionalTitle && (
                    <p className="text-[10px] text-earth/50 uppercase tracking-widest">{product.functionalTitle}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-earth/10">
          <Button type="submit">Create Bundle</Button>
          <Link href="/admin/bundles">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
