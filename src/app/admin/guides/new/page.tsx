import { createGuide } from "../../../actions/content-admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New Guide | Admin — ORIGONÆ" };

export default async function NewGuidePage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/guides" className="text-earth/50 hover:text-earth transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">New Care Guide</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">Add a new ritual care guide to the editorial library.</p>
        </div>
      </div>

      <form action={createGuide} className="bg-cream border border-earth/10 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Title *</label>
            <Input name="title" required placeholder="e.g. Pre-Poo Ritual" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Slug *</label>
            <Input name="slug" required placeholder="e.g. pre-poo-ritual" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Description *</label>
          <Textarea name="description" required rows={5} placeholder="Editorial description of the guide and its ritual purpose..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Image URL</label>
          <Input name="image" type="url" placeholder="https://... or /path/to/image.jpg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Method Number</label>
            <Input name="methodNumber" type="number" defaultValue="1" min="1" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Sort Order</label>
            <Input name="sortOrder" type="number" defaultValue="0" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-earth">Published</label>
            <select name="isPublished" className="w-full h-10 px-3 border border-earth/20 bg-cream text-earth text-sm focus:outline-none focus:ring-2 focus:ring-earth/40">
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-earth/10">
          <Button type="submit">Create Guide</Button>
          <Link href="/admin/guides">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
