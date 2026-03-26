import Link from "next/link";
import { adminGetAllGuides, deleteGuide } from "../../actions/content-admin";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, BookMarked } from "lucide-react";

type GuideRow = Awaited<ReturnType<typeof adminGetAllGuides>>[number];


export const metadata = {
  title: "Care Guides | Admin — ORIGONÆ",
};

export default async function AdminGuidesPage() {
  const guides = await adminGetAllGuides();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Care Guides</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">
            Manage the ritual care guides shown on the /guides editorial page.
          </p>
        </div>
        <Link href="/admin/guides/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Guide
          </Button>
        </Link>
      </div>

      {guides.length === 0 ? (
        <div className="bg-cream border border-earth/10 p-12 text-center space-y-4">
          <BookMarked className="h-10 w-10 text-earth/20 mx-auto" />
          <p className="text-earth/50 text-sm">No guides yet. Add your first one.</p>
          <Link href="/admin/guides/new">
            <Button>Add First Guide</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-cream border border-earth/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth/10 bg-stone/30">
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">#</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Title</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Sort Order</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Image</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Status</th>
                <th className="text-right py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide: GuideRow) => (
                <tr key={guide.id} className="border-b border-earth/5 hover:bg-stone/20 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-lg font-serif text-bronze">{String(guide.methodNumber).padStart(2, "0")}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-earth font-medium">{guide.title}</p>
                    <p className="text-[10px] text-earth/40 font-mono">{guide.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-earth/60 text-xs">{guide.sortOrder}</td>
                  <td className="py-3 px-4">
                    {guide.image ? (
                      <span className="text-[10px] text-bronze uppercase tracking-widest">✓ Set</span>
                    ) : (
                      <span className="text-[10px] text-earth/30 uppercase tracking-widest">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 ${guide.isPublished ? "bg-bronze/10 text-bronze" : "bg-earth/5 text-earth/40"}`}>
                      {guide.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/guides/${guide.id}/edit`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteGuide(guide.id);
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
