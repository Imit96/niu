"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface ArticleFormProps {
  article?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    featuredImage: string | null;
    mediaUrl?: string | null;
    isFeatured: boolean;
    relatedProductId: string | null;
  };
  products: { id: string; name: string }[];
  handleSubmit: (formData: FormData) => void;
}

export default function ArticleForm({ article, products, handleSubmit }: ArticleFormProps) {
  const [featuredImage, setFeaturedImage] = useState<string[]>(
    article?.featuredImage ? [article.featuredImage] : []
  );

  return (
    <form action={handleSubmit} className="space-y-6 bg-cream p-6 border border-earth/10 shadow-sm">
      {/* Pass uploaded featured image URL as hidden field */}
      <input type="hidden" name="featuredImage" value={featuredImage[0] ?? ""} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-xs font-semibold uppercase tracking-widest text-earth">Title</label>
          <input
            required
            id="title"
            name="title"
            type="text"
            defaultValue={article?.title}
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
            placeholder="The Art of the Cleanse"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-xs font-semibold uppercase tracking-widest text-earth">Slug</label>
          <input
            required
            id="slug"
            name="slug"
            type="text"
            defaultValue={article?.slug}
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
            placeholder="the-art-of-the-cleanse"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-xs font-semibold uppercase tracking-widest text-earth">Category</label>
          <input
            required
            id="category"
            name="category"
            type="text"
            defaultValue={article?.category}
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
            placeholder="Ritual & Wellness"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="relatedProductId" className="text-xs font-semibold uppercase tracking-widest text-earth">Related Call-to-Action Product</label>
          <select
            id="relatedProductId"
            name="relatedProductId"
            defaultValue={article?.relatedProductId ?? ""}
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
          >
            <option value="">None</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-earth">Featured Image</label>
        <ImageUploader value={featuredImage} onChange={(urls) => setFeaturedImage(urls.slice(0, 1))} />
        <p className="text-[10px] text-earth/50">Upload one image. This appears as the article hero.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="mediaUrl" className="text-xs font-semibold uppercase tracking-widest text-earth">
          Media Embed — Video, YouTube or GIF
        </label>
        <input
          id="mediaUrl"
          name="mediaUrl"
          type="url"
          defaultValue={article?.mediaUrl ?? ""}
          className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
          placeholder="https://youtube.com/watch?v=... or https://example.com/clip.mp4"
        />
        <p className="text-[10px] text-earth/50">
          Paste a YouTube / Vimeo link, a direct video URL (.mp4), or a GIF URL. Displayed inline while readers scroll through the article.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-xs font-semibold uppercase tracking-widest text-earth">Excerpt</label>
        <textarea
          required
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt}
          className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
          placeholder="A short summary of the article..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-xs font-semibold uppercase tracking-widest text-earth">Content (Markdown / HTML)</label>
        <textarea
          required
          id="content"
          name="content"
          rows={10}
          defaultValue={article?.content}
          className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm font-mono"
          placeholder="Write the full article content here..."
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isFeatured"
          name="isFeatured"
          defaultChecked={article?.isFeatured}
          className="h-4 w-4 text-bronze focus:ring-bronze border-earth/20 rounded-sm"
        />
        <label htmlFor="isFeatured" className="text-sm text-earth">Set as Featured Article</label>
      </div>

      <div className="pt-4 border-t border-earth/10">
        <Button type="submit" className="w-full md:w-auto px-8">
          {article ? "Save Changes" : "Publish Article"}
        </Button>
      </div>
    </form>
  );
}
