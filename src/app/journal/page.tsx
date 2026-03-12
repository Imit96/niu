import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getArticles, getFeaturedArticle } from "@/app/actions/article";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Journal | ORIGONÆ",
  description: "Editorial stories exploring African heritage, formulation science, and intent-driven beauty.",
};

export default async function JournalPage() {
  const [allArticles, dbFeatured] = await Promise.all([getArticles(), getFeaturedArticle()]);

  // isFeatured = hero at the top; remaining articles sorted by sortOrder in the grid
  const featuredArticle = dbFeatured ?? allArticles[0] ?? null;
  const recentArticles = allArticles.filter((a: any) => a.id !== featuredArticle?.id);

  return (
    <div className="flex flex-col w-full bg-sand min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center border-b border-earth/20 bg-cream">
        <h1 className="text-4xl md:text-6xl font-serif text-earth uppercase tracking-widest mb-6">The Journal</h1>
        <p className="text-lg text-earth/70 max-w-2xl mx-auto font-light">
          Observations on heritage, hair architecture, botanical potency, and the quiet power of ritual.
        </p>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-24 px-6 border-b border-earth/20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="relative aspect-[4/3] w-full bg-stone overflow-hidden">
              {featuredArticle.featuredImage ? (
                <img src={featuredArticle.featuredImage} alt={featuredArticle.title} className="object-cover w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest">
                  Featured Editorial Image
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-xs font-semibold tracking-widest uppercase text-bronze">
                <span>{featuredArticle.category}</span>
                <span className="text-earth/40">•</span>
                <span className="text-earth/60">
                  {new Date(featuredArticle.datePublished).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-earth leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-earth/80 leading-loose text-lg font-light">
                {featuredArticle.excerpt}
              </p>
              <Link href={`/journal/${featuredArticle.slug}`} className="inline-block pt-4 text-earth border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors">
                Read Full Article
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Grid */}
      {recentArticles.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-[1440px] mx-auto">
            <h3 className="text-2xl font-serif text-earth uppercase tracking-widest mb-12 text-center lg:text-left">Recent Dispatches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {recentArticles.map((article: any) => (
                <Link key={article.id} href={`/journal/${article.slug}`} className="group cursor-pointer block">
                  <div className="relative aspect-[3/4] w-full bg-stone mb-6 overflow-hidden">
                    {article.featuredImage ? (
                      <img src={article.featuredImage} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-earth/5 group-hover:bg-transparent transition-colors duration-500"></div>
                    )}
                    {!article.featuredImage && (
                      <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest text-sm">
                        Editorial Frame
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-semibold tracking-widest uppercase text-bronze">
                      <span>{article.category}</span>
                      <span className="text-earth/50">
                        {new Date(article.datePublished).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="text-2xl font-serif text-earth group-hover:underline underline-offset-4 decoration-1 decoration-earth/40">{article.title}</h4>
                    <p className="text-earth/80 text-sm leading-relaxed font-light line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-24">
            <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
              Load More Entries
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
