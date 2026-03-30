import Link from "next/link";
import { getArticleBySlug } from "@/app/actions/article";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import AddToCartButton from "@/app/[locale]/shop/[id]/AddToCartButton";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";

export const revalidate = 3600; // Revalidate every hour

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function ArticleMedia({ url }: { url: string }) {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return (
      <div className="aspect-video w-full bg-stone border border-earth/10">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Article video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return (
      <div className="aspect-video w-full bg-stone border border-earth/10">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Article video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  const lower = url.toLowerCase();
  const isVideo = lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg");
  if (isVideo) {
    return (
      <video
        src={url}
        controls
        playsInline
        className="w-full border border-earth/10"
      />
    );
  }

  // GIF or static image
  return (
    <img
      src={url}
      alt="Article media"
      className="w-full border border-earth/10"
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug, resolvedParams.locale);
  if (!article) return { title: "Article Not Found | ORIGONÆ" };
  return {
    title: `${article.title} | ORIGONÆ Journal`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const [article, t] = await Promise.all([
    getArticleBySlug(resolvedParams.slug, resolvedParams.locale),
    getTranslations("journal"),
  ]);

  if (!article) {
    notFound();
  }

  // Cast to access mediaUrl — field added via db push; TS server may lag on type refresh
  const mediaUrl = (article as Record<string, unknown>).mediaUrl as string | null | undefined;

  return (
    <div className="bg-sand min-h-screen">
      <article className="pt-32 pb-24">
        {/* Header Section */}
        <header className="px-6 mb-16 max-w-4xl mx-auto text-center space-y-6">
          <Link href="/journal" className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-bronze hover:text-earth transition-colors mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" /> {t("backToJournal")}
          </Link>
          <div className="flex items-center justify-center space-x-4 text-xs font-semibold tracking-widest uppercase text-earth/50">
            <span>{article.category}</span>
            <span>•</span>
            <span>{new Date(article.datePublished).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-earth leading-tight">
            {article.title}
          </h1>
          <p className="text-lg md:text-xl text-earth/70 font-light max-w-2xl mx-auto leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="max-w-6xl mx-auto px-6 mb-24">
            <div className="aspect-[16/9] w-full overflow-hidden bg-stone">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content — MDX rendered */}
        <div className="px-6 max-w-3xl mx-auto prose prose-p:text-earth/80 prose-p:font-light prose-p:text-lg prose-p:leading-loose prose-headings:font-serif prose-headings:text-earth prose-headings:font-normal prose-h2:text-3xl prose-h3:text-2xl prose-a:text-bronze prose-a:underline prose-strong:text-earth prose-strong:font-semibold prose-blockquote:border-l-bronze prose-blockquote:text-earth/70 prose-blockquote:font-serif prose-blockquote:text-xl prose-ul:text-earth/80 prose-ol:text-earth/80 prose-hr:border-earth/20">
          <MDXRemote source={article.content} />
        </div>

        {/* Inline Media — video, YouTube, Vimeo, GIF */}
        {mediaUrl && (
          <div className="max-w-3xl mx-auto px-6 my-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-earth/40 mb-4">Featured Media</p>
            <ArticleMedia url={mediaUrl} />
          </div>
        )}

        {/* Call to Action Section */}
        {article.relatedProduct && (
          <section className="mt-24 py-24 px-6 bg-stone border-y border-earth/20">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2 aspect-square relative bg-sand border border-ash/30 overflow-hidden shadow-sm hover:border-bronze transition-colors">
                {article.relatedProduct.images?.[0] && article.relatedProduct.images[0] !== "Product Image Placeholder" ? (
                  <Image
                    src={article.relatedProduct.images[0]}
                    alt={article.relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-earth/30 uppercase tracking-widest font-serif text-xs">
                    Product Image
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-8 text-center md:text-left">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-bronze uppercase tracking-widest">{t("featuredDispatch")}</h3>
                  <h4 className="text-4xl md:text-5xl font-serif text-earth">{article.relatedProduct.name}</h4>
                  <p className="text-xl text-earth/80 font-light">{article.relatedProduct.functionalTitle}</p>
                </div>

                <p className="text-earth/70 leading-relaxed font-light text-base md:text-lg whitespace-pre-wrap">
                  {article.relatedProduct.description}
                </p>

                <div className="pt-8">
                  {article.relatedProduct.variants?.[0] ? (
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <div className="sm:hidden text-xl text-earth font-medium">
                        <PriceDisplay amountInCents={article.relatedProduct.variants[0].priceInCents} />
                      </div>
                      <div className="w-full sm:w-auto">
                        <AddToCartButton
                          id={article.relatedProduct.variants[0].id}
                          productId={article.relatedProduct.id}
                          slug={article.relatedProduct.slug}
                          name={article.relatedProduct.name}
                          priceInCents={article.relatedProduct.variants[0].priceInCents}
                          size={article.relatedProduct.variants[0].size || ""}
                          image={article.relatedProduct.images?.[0] || ""}
                          inventoryCount={article.relatedProduct.variants[0].inventoryCount || 0}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-earth/20 bg-earth/5 text-earth text-center text-sm tracking-widest uppercase">
                      {t("productUnavailable")}
                    </div>
                  )}
                </div>

                <div className="pt-4 md:pt-8 text-center md:text-left">
                   <Link href={`/shop/${article.relatedProduct.slug || article.relatedProduct.id}`} className="inline-block text-xs uppercase tracking-widest text-bronze hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-1">
                      {t("discoverDetails")}
                   </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Footer Area */}
      <section className="py-24 border-t border-earth/20 bg-cream px-6 text-center">
        <h3 className="text-2xl font-serif text-earth uppercase tracking-widest mb-6">{t("exploreJournal")}</h3>
        <Link href="/journal">
          <span className="inline-flex items-center justify-center px-8 py-4 border border-earth text-earth uppercase tracking-widest text-xs font-semibold hover:bg-earth hover:text-cream transition-colors cursor-pointer">
            {t("viewAllDispatches")}
          </span>
        </Link>
      </section>
    </div>
  );
}
