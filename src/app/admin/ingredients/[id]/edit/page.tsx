import { adminGetIngredientById, updateIngredient } from "../../../../actions/content-admin";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Ingredient | Admin — ORIGONÆ" };

export default async function EditIngredientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, products] = await Promise.all([
    adminGetIngredientById(id),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!item) notFound();

  const action = async (formData: FormData) => {
    "use server";
    await updateIngredient(id, formData);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/ingredients" className="text-earth/50 hover:text-earth transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Edit Ingredient</h1>
          <p className="text-earth/60 mt-1 text-sm font-mono text-xs">{item.slug}</p>
        </div>
      </div>

      <form action={action} className="bg-cream border border-earth/10 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Name *</label>
            <Input name="name" required defaultValue={item.name} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Slug *</label>
            <Input name="slug" required defaultValue={item.slug} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Category *</label>
          <Input name="category" required defaultValue={item.category} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Origin</label>
          <Input name="origin" defaultValue={item.origin ?? ""} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Description *</label>
          <Textarea name="description" required rows={4} defaultValue={item.description} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Benefits</label>
          <Textarea name="benefitsText" rows={3} defaultValue={item.benefitsText ?? ""} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Sort Order</label>
            <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Linked Product</label>
            <select name="relatedProductId" defaultValue={item.relatedProductId ?? ""} className="w-full h-10 px-3 border border-earth/20 bg-cream text-earth text-sm focus:outline-none focus:ring-2 focus:ring-earth/40">
              <option value="">— None —</option>
              {products.map((p: { id: string; name: string }) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Published</label>
            <select name="isPublished" defaultValue={item.isPublished ? "true" : "false"} className="w-full h-10 px-3 border border-earth/20 bg-cream text-earth text-sm focus:outline-none focus:ring-2 focus:ring-earth/40">
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-earth/10">
          <Button type="submit">Save Changes</Button>
          <Link href="/admin/ingredients">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
