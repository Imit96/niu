import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "The Journal | Originæ",
  description: "Editorial stories exploring African heritage, ritual aesthetics, ingredient science, and intent-driven beauty.",
};

const FEATURED_ARTICLE = {
  id: "the-art-of-the-cleanse",
  title: "The Art of the Cleanse",
  category: "Ritual & Wellness",
  excerpt: "Cleansing is not merely the removal of buildup, but an intentional reset. We explore the historical significance of the hammam and how Atlas Mountain clay fundamentally shifts the scalp's ecosystem.",
  date: "August 12, 2024",
};

const ARTICLES = [
  {
    id: "science-of-kalahari",
    title: "Decoding the Kalahari Melon",
    category: "Hair Science Simplified",
    excerpt: "Why this desert survivor holds the key to lightweight, deeply penetrative hydration without the risk of follicle blockage.",
    date: "July 28, 2024",
  },
  {
    id: "heritage-braiding",
    title: "Geometry of the Crown",
    category: "African Heritage Stories",
    excerpt: "The mathematical and spiritual significance woven into traditional West African braiding styles.",
    date: "July 15, 2024",
  },
  {
    id: "minimalism-and-texture",
    title: "Texture as Architecture",
    category: "Fashion & Culture",
    excerpt: "How modern editorial styling is shifting focus from manipulation to structural exaggeration of natural hair types.",
    date: "June 03, 2024",
  }
];

export default function JournalPage() {
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
      <section className="py-24 px-6 border-b border-earth/20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative aspect-[4/3] w-full bg-stone">
            {/* Placeholder for editorial image */}
            <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest">
              Featured Editorial Image
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-xs font-semibold tracking-widest uppercase text-bronze">
              <span>{FEATURED_ARTICLE.category}</span>
              <span className="text-earth/40">•</span>
              <span className="text-earth/60">{FEATURED_ARTICLE.date}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-earth leading-tight">
              {FEATURED_ARTICLE.title}
            </h2>
            <p className="text-earth/80 leading-loose text-lg font-light">
              {FEATURED_ARTICLE.excerpt}
            </p>
            <Link href={`/journal/${FEATURED_ARTICLE.id}`} className="inline-block pt-4 text-earth border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors">
              Read Full Article
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Grid */}
      <section className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <h3 className="text-2xl font-serif text-earth uppercase tracking-widest mb-12 text-center lg:text-left">Recent Dispatches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {ARTICLES.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] w-full bg-stone mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-earth/5 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest text-sm">
                    Editorial Frame
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-semibold tracking-widest uppercase text-bronze">
                    <span>{article.category}</span>
                    <span className="text-earth/50">{article.date}</span>
                  </div>
                  <h4 className="text-2xl font-serif text-earth group-hover:underline underline-offset-4 decoration-1 decoration-earth/40">{article.title}</h4>
                  <p className="text-earth/80 text-sm leading-relaxed font-light line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Load More (Visual Only) */}
        <div className="text-center mt-24">
          <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
            Load More Entries
          </Button>
        </div>
      </section>
    </div>
  );
}
