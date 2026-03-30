import Link from "next/link";
import { adminGetAllIngredients, deleteIngredient } from "../../actions/content-admin";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, FlaskConical } from "lucide-react";

type IngredientRow = Awaited<ReturnType<typeof adminGetAllIngredients>>[number];


export const metadata = {
  title: "Ingredients | Admin — ORIGONÆ",
};

export default async function AdminIngredientsPage() {
  const ingredients = await adminGetAllIngredients();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Ingredients</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">
            Manage the ingredient philosophy content shown on the /ingredients editorial page.
          </p>
        </div>
        <Link href="/admin/ingredients/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Ingredient
          </Button>
        </Link>
      </div>

      {ingredients.length === 0 ? (
        <div className="bg-cream border border-earth/10 p-12 text-center space-y-4">
          <FlaskConical className="h-10 w-10 text-earth/20 mx-auto" />
          <p className="text-earth/50 text-sm">No ingredients yet. Add your first one.</p>
          <Link href="/admin/ingredients/new">
            <Button>Add First Ingredient</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-cream border border-earth/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth/10 bg-stone/30">
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Name</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Category</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Origin</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Linked Product</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Status</th>
                <th className="text-right py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((item: IngredientRow) => (
                <tr key={item.id} className="border-b border-earth/5 hover:bg-stone/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-earth font-medium">{item.name}</p>
                    <p className="text-[10px] text-earth/40 font-mono">{item.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-earth/70 text-xs">{item.category}</td>
                  <td className="py-3 px-4 text-earth/60 text-xs">{item.origin || "—"}</td>
                  <td className="py-3 px-4 text-earth/60 text-xs">{(item as any).products?.map((p: { name: string }) => p.name).join(", ") || "—"}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 ${item.isPublished ? "bg-bronze/10 text-bronze" : "bg-earth/5 text-earth/40"}`}>
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/ingredients/${item.id}/edit`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteIngredient(item.id);
                      }}>
                        <Button
                          type="submit"
                          variant="secondary"
                          size="sm"
                          className="flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
