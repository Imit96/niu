import Link from "next/link";
import { Plus } from "lucide-react";
import { getArticles } from "@/app/actions/article";
import { Button } from "@/components/ui/Button";
import ArticlesListClient from "./ArticlesListClient";

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="space-y-8 min-h-screen pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Journal</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">
            Manage editorial stories. Use the arrows to set the display order — the first article appears at the top of the journal.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Article</span>
          </Button>
        </Link>
      </div>

      <ArticlesListClient initialArticles={articles} />
    </div>
  );
}
