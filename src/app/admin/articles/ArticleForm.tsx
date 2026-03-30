"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { ChevronDown, ChevronUp, Eye, PenLine } from "lucide-react";

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
    titleFr?: string | null;
    categoryFr?: string | null;
    excerptFr?: string | null;
    contentFr?: string | null;
  };
  products: { id: string; name: string }[];
  handleSubmit: (formData: FormData) => void;
}

const CHEAT_SHEET = [
  { syntax: "# Heading 1", output: "Large page heading" },
  { syntax: "## Heading 2", output: "Section heading" },
  { syntax: "### Heading 3", output: "Sub-section heading" },
  { syntax: "**bold text**", output: "Bold" },
  { syntax: "_italic text_", output: "Italic" },
  { syntax: "> Blockquote", output: "Pull-quote / callout" },
  { syntax: "- Item one\n- Item two", output: "Bullet list" },
  { syntax: "1. First\n2. Second", output: "Numbered list" },
  { syntax: "[Link text](https://url)", output: "Hyperlink" },
  { syntax: "![alt text](https://img-url)", output: "Inline image" },
  { syntax: "---", output: "Horizontal divider" },
  { syntax: "`inline code`", output: "Inline code" },
];

function MDXEditor({
  name,
  defaultValue,
  required,
  placeholder,
  rows = 18,
}: {
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowCheatSheet((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-earth/50 hover:text-bronze transition-colors border border-earth/20 px-2.5 py-1.5"
        >
          {showCheatSheet ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          MDX Cheat Sheet
        </button>
      </div>

      {/* Cheat Sheet Panel */}
      {showCheatSheet && (
        <div className="border border-earth/20 bg-stone/30 p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-earth/40 mb-3">Quick Reference</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHEAT_SHEET.map((item) => (
              <div key={item.syntax} className="flex items-start gap-3 py-1.5 border-b border-earth/10 last:border-0">
                <code className="text-[11px] font-mono text-bronze bg-cream px-1.5 py-0.5 whitespace-pre shrink-0">
                  {item.syntax.split("\n")[0]}{item.syntax.includes("\n") ? " …" : ""}
                </code>
                <span className="text-[11px] text-earth/60 pt-0.5">{item.output}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-earth/40 pt-2 border-t border-earth/10">
            Full MDX is supported — use standard Markdown syntax above.
          </p>
        </div>
      )}

      {/* Write / Preview Tabs */}
      <div className="border border-earth/20">
        <div className="flex border-b border-earth/20">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
              tab === "write" ? "bg-earth text-cream" : "text-earth/50 hover:text-earth bg-stone/30"
            }`}
          >
            <PenLine className="h-3 w-3" /> Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
              tab === "preview" ? "bg-earth text-cream" : "text-earth/50 hover:text-earth bg-stone/30"
            }`}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
          {tab === "preview" && (
            <span className="ml-auto self-center pr-4 text-[9px] uppercase tracking-widest text-earth/30">
              Approximate rendering
            </span>
          )}
        </div>

        {tab === "write" ? (
          <textarea
            id={name}
            name={name}
            required={required}
            rows={rows}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 bg-stone/50 focus:outline-none focus:ring-1 focus:ring-bronze text-sm font-mono"
            placeholder={placeholder}
          />
        ) : (
          <>
            {/* Hidden field so form submits content even in preview tab */}
            <textarea
              name={name}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="min-h-[18rem] px-8 py-6 bg-sand overflow-auto">
              {value.trim() ? (
                <div className="prose prose-p:text-earth/80 prose-p:font-light prose-p:text-base prose-p:leading-loose prose-headings:font-serif prose-headings:text-earth prose-headings:font-normal prose-h2:text-2xl prose-h3:text-xl prose-a:text-bronze prose-a:underline prose-strong:text-earth prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-bronze prose-blockquote:text-earth/70 prose-blockquote:italic prose-ul:text-earth/80 prose-ol:text-earth/80 prose-hr:border-earth/20 max-w-none">
                  <ReactMarkdown>{value}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-earth/30 text-sm italic text-center py-16">
                  Nothing to preview yet — switch to Write and add some content.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
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

      {/* Content — MDX Editor */}
      <div className="space-y-1">
        <label htmlFor="content" className="text-xs font-semibold uppercase tracking-widest text-earth">
          Content <span className="text-bronze normal-case tracking-normal font-normal">— Markdown / MDX</span>
        </label>
        <MDXEditor
          name="content"
          defaultValue={article?.content}
          required
          placeholder={`## Section Heading\n\nBody paragraph text here.\n\n> Blockquote for pull-quotes\n\n**Bold** and _italic_ both work.\n\n- Bulleted list\n- Second item`}
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

      {/* FR Translation */}
      <div className="space-y-4 pt-4 border-t border-earth/10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-earth/70">FR Translation (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-earth">Title (FR)</label>
            <input
              id="titleFr"
              name="titleFr"
              type="text"
              defaultValue={article?.titleFr ?? ""}
              className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
              placeholder="Titre en francais"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-earth">Category (FR)</label>
            <input
              id="categoryFr"
              name="categoryFr"
              type="text"
              defaultValue={article?.categoryFr ?? ""}
              className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
              placeholder="Categorie en francais"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-earth">Excerpt (FR)</label>
          <textarea
            id="excerptFr"
            name="excerptFr"
            rows={2}
            defaultValue={article?.excerptFr ?? ""}
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
            placeholder="Resume en francais..."
          />
        </div>

        {/* Content FR — MDX Editor */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-earth">
            Content (FR) <span className="text-bronze normal-case tracking-normal font-normal">— Markdown / MDX</span>
          </label>
          <MDXEditor
            name="contentFr"
            defaultValue={article?.contentFr}
            rows={14}
            placeholder="Contenu complet en francais..."
          />
        </div>
      </div>

      <div className="pt-4 border-t border-earth/10">
        <Button type="submit" className="w-full md:w-auto px-8">
          {article ? "Save Changes" : "Publish Article"}
        </Button>
      </div>
    </form>
  );
}
