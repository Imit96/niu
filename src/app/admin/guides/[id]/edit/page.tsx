import { adminGetGuideById, updateGuide } from "../../../../actions/content-admin";
import { getAdminProducts } from "../../../../actions/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SingleImageUploader } from "@/components/ui/SingleImageUploader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Guide | Admin — ORIGONÆ" };

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [guide, { products }] = await Promise.all([
    adminGetGuideById(id),
    getAdminProducts(1, 200),
  ]);

  if (!guide) notFound();

  const action = async (formData: FormData) => {
    "use server";
    await updateGuide(id, formData);
  };

  const currentProductIds = new Set(((guide as any).products ?? []).map((p: { id: string }) => p.id));

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/guides" className="text-earth/50 hover:text-earth transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Edit Guide</h1>
          <p className="text-earth/60 mt-1 text-xs font-mono">{guide.slug}</p>
        </div>
      </div>

      <form action={action} className="bg-cream border border-earth/10 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Title *</label>
            <Input name="title" required defaultValue={guide.title} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Slug *</label>
            <Input name="slug" required defaultValue={guide.slug} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Description *</label>
          <Textarea name="description" required rows={5} defaultValue={guide.description} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Title (FR)</label>
          <Input name="titleFr" defaultValue={(guide as any).titleFr ?? ""} placeholder="Titre en francais" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Description (FR)</label>
          <Textarea name="descriptionFr" rows={5} defaultValue={(guide as any).descriptionFr ?? ""} placeholder="Description en francais..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Image</label>
          <SingleImageUploader name="image" defaultValue={(guide as any).image ?? ""} positionName="imagePosition" defaultPosition={(guide as any).imagePosition ?? "center"} />
        </div>

        {/* Include Products */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Include Products *</label>
          <p className="text-[10px] text-earth/50">Select all products featured in this guide. They will appear as shop CTAs on the guide page.</p>
          <div className="space-y-2 max-h-72 overflow-y-auto border border-earth/10 p-3">
            {products.map((p) => (
              <label key={p.id} className="flex items-start gap-3 p-3 hover:bg-stone/30 cursor-pointer transition-colors rounded-sm">
                <input
                  type="checkbox"
                  name="productIds"
                  value={p.id}
                  defaultChecked={currentProductIds.has(p.id)}
                  className="mt-0.5 accent-earth h-4 w-4 shrink-0"
                />
                <div>
                  <p className="text-sm text-earth font-medium">{p.name}</p>
                  {(p as any).functionalTitle && (
                    <p className="text-[10px] text-earth/50 uppercase tracking-widest">{(p as any).functionalTitle}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Method Number</label>
            <Input name="methodNumber" type="number" defaultValue={guide.methodNumber} min="1" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Sort Order</label>
            <Input name="sortOrder" type="number" defaultValue={guide.sortOrder} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Published</label>
            <select name="isPublished" defaultValue={guide.isPublished ? "true" : "false"} className="w-full h-10 px-3 border border-earth/20 bg-cream text-earth text-sm focus:outline-none focus:ring-2 focus:ring-earth/40">
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-earth/10">
          <Button type="submit">Save Changes</Button>
          <Link href="/admin/guides">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
