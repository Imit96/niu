import Link from "next/link";
import { adminGetAllBundles, deleteBundle } from "../../actions/bundle-admin";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

export const metadata = {
  title: "Ritual Bundles | Admin — ORIGONÆ",
};

type BundleRow = Awaited<ReturnType<typeof adminGetAllBundles>>[number];

export default async function AdminBundlesPage() {
  const bundles = await adminGetAllBundles();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Ritual Bundles</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">
            Create and manage curated product bundles shown on the /bundles page.
          </p>
        </div>
        <Link href="/admin/bundles/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Bundle
          </Button>
        </Link>
      </div>

      {bundles.length === 0 ? (
        <div className="bg-cream border border-earth/10 p-12 text-center space-y-4">
          <Package className="h-10 w-10 text-earth/20 mx-auto" />
          <p className="text-earth/50 text-sm">No bundles yet. Create your first ritual bundle.</p>
          <Link href="/admin/bundles/new">
            <Button>Create First Bundle</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-cream border border-earth/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth/10 bg-stone/30">
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Name</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Products</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Bundle Price</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Slug</th>
                <th className="text-right py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((bundle: BundleRow) => (
                <tr key={bundle.id} className="border-b border-earth/5 hover:bg-stone/20 transition-colors">
                  <td className="py-3 px-4">
                    <Link href={`/bundles/${bundle.slug}`} target="_blank" className="text-earth font-medium hover:text-bronze transition-colors">
                      {bundle.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-earth/70 text-xs">
                    <span className="font-semibold text-earth">{bundle.products.length}</span>
                    {" "}regimen{bundle.products.length !== 1 ? "s" : ""}
                    <br />
                    <span className="text-earth/40">{bundle.products.map(p => p.name).join(", ")}</span>
                  </td>
                  <td className="py-3 px-4 text-earth font-medium">
                    ₦ {(bundle.priceInCents / 100).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-earth/40 text-xs font-mono">{bundle.slug}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/bundles/${bundle.id}/edit`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteBundle(bundle.id);
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
