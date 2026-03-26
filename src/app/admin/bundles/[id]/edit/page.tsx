import { adminGetBundleById, updateBundle } from "../../../../actions/bundle-admin";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Bundle | Admin — ORIGONÆ" };

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [bundle, allProducts] = await Promise.all([
    adminGetBundleById(id),
    prisma.product.findMany({
      select: { id: true, name: true, functionalTitle: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!bundle) notFound();

  const selectedProductIds = new Set(bundle.products.map((p: { id: string }) => p.id));

  const action = async (formData: FormData) => {
    "use server";
    await updateBundle(id, formData);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/bundles" className="text-earth/50 hover:text-earth transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Edit Bundle</h1>
          <p className="text-earth/60 mt-1 text-xs font-mono">{bundle.slug}</p>
        </div>
      </div>

      <form action={action} className="bg-cream border border-earth/10 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Bundle Name *</label>
            <Input name="name" required defaultValue={bundle.name} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Slug *</label>
            <Input name="slug" required defaultValue={bundle.slug} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Description *</label>
          <Textarea name="description" required rows={4} defaultValue={bundle.description} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Bundle Price (₦) *</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={(bundle.priceInCents / 100).toFixed(2)}
          />
          <p className="text-[10px] text-earth/50">Enter the full amount in Naira — e.g. 45000 for ₦45,000</p>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Include Products *</label>
          <p className="text-[10px] text-earth/50">Currently selected: {bundle.products.length} regimen{bundle.products.length !== 1 ? "s" : ""}.</p>
          <div className="space-y-2 max-h-72 overflow-y-auto border border-earth/10 p-3">
            {allProducts.map((product: { id: string; name: string; functionalTitle: string | null }) => (
              <label key={product.id} className="flex items-start gap-3 p-3 hover:bg-stone/30 cursor-pointer transition-colors rounded-sm">
                <input
                  type="checkbox"
                  name="productIds"
                  value={product.id}
                  defaultChecked={selectedProductIds.has(product.id)}
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
          <Button type="submit">Save Changes</Button>
          <Link href="/admin/bundles">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
