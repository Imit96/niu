"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { moveArticle, deleteArticle } from "@/app/actions/article";

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  isFeatured: boolean;
  datePublished: Date;
}

export default function ArticlesListClient({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [pending, startTransition] = useTransition();

  const move = (id: string, direction: "up" | "down") => {
    // Optimistic reorder
    const index = articles.findIndex((a) => a.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= articles.length) return;

    const next = [...articles];
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setArticles(next);

    startTransition(async () => {
      await moveArticle(id, direction);
    });
  };

  const remove = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    startTransition(async () => {
      await deleteArticle(id);
    });
  };

  return (
    <div className="bg-cream border border-earth/10 overflow-hidden shadow-sm">
      <ul className="divide-y divide-earth/10">
        {articles.length === 0 ? (
          <li className="p-8 text-center text-earth/50">
            No articles found. Start by writing your first journal entry.
          </li>
        ) : (
          articles.map((article, index) => (
            <li
              key={article.id}
              className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-stone/50 transition-colors"
            >
              {/* Reorder controls */}
              <div className="flex flex-col gap-1 mr-4 flex-shrink-0">
                <button
                  type="button"
                  disabled={index === 0 || pending}
                  onClick={() => move(article.id, "up")}
                  className="p-1 text-earth/40 hover:text-earth disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === articles.length - 1 || pending}
                  onClick={() => move(article.id, "down")}
                  className="p-1 text-earth/40 hover:text-earth disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Position badge */}
              <div className="hidden md:flex items-center justify-center w-8 h-8 border border-earth/20 text-xs font-semibold text-earth/40 mr-4 flex-shrink-0">
                {index + 1}
              </div>

              {/* Article info */}
              <div className="flex-1 space-y-1 min-w-0">
                <h3 className="text-lg font-serif text-earth">{article.title}</h3>
                <p className="text-xs font-semibold tracking-widest uppercase text-bronze">
                  {article.category}{article.isFeatured && " ★ Featured"}
                </p>
                <p className="text-sm text-earth/60 max-w-lg line-clamp-2">{article.excerpt}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4 mt-6 md:mt-0 w-full md:w-auto justify-end flex-shrink-0">
                <div className="text-right mr-4">
                  <p className="text-xs text-earth/50 uppercase tracking-widest">
                    {new Date(article.datePublished).toLocaleDateString()}
                  </p>
                  {index === 0 && (
                    <p className="text-[10px] text-bronze uppercase tracking-widest mt-0.5">Top of Journal</p>
                  )}
                </div>
                <Link href={`/admin/articles/${article.id}/edit`}>
                  <Button variant="secondary" size="sm" className="px-3 border-earth text-earth hover:bg-earth hover:text-cream">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => remove(article.id)}
                  disabled={pending}
                  className="px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
