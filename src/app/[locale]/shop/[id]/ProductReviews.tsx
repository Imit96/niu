"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { createReview } from "@/app/actions/review";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  isLoggedIn: boolean;
  hasPurchased: boolean;
}

export function ProductReviews({ productId, reviews, isLoggedIn, hasPurchased }: ProductReviewsProps) {
  const t = useTranslations("shop.reviews");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error(t("selectRating"));
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("rating", rating.toString());
      formData.append("comment", comment);

      const result = await createReview(productId, formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || t("reviewSubmitted"));
        setShowForm(false);
        setRating(0);
        setComment("");
      }
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderCTA = () => {
    if (!isLoggedIn) {
      return <p className="text-sm text-earth/60 italic">{t("signInToReview")}</p>;
    }
    if (!hasPurchased) {
      return (
        <p className="text-sm text-earth/60 italic">
          {t("purchaseToReview")}
        </p>
      );
    }
    return (
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-6 py-3 border border-earth text-earth hover:bg-earth text-sm uppercase tracking-widest font-semibold hover:text-cream transition-colors"
      >
        {showForm ? t("cancel") : t("shareYourRitual")}
      </button>
    );
  };

  return (
    <section className="py-24 px-6 bg-sand border-t border-earth/10">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-earth/20 pb-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">{t("theResonance")}</p>
            <h2 className="text-3xl font-serif text-earth uppercase tracking-wide">{t("voicesOf")}</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-4 text-earth/80 pt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Number(averageRating) ? "fill-bronze text-bronze" : "text-ash/50"}`}
                    />
                  ))}
                </div>
                <span className="text-sm">{averageRating} · {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</span>
              </div>
            )}
          </div>

          <div className="shrink-0">{renderCTA()}</div>
        </div>

        {/* Review Form */}
        {showForm && isLoggedIn && hasPurchased && (
          <form onSubmit={handleSubmit} className="bg-cream p-8 border border-earth/10 space-y-6">
            <h3 className="text-lg font-serif text-earth uppercase tracking-widest">{t("writeReview")}</h3>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-earth/60">{t("rating")}</label>
              <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${(hoverRating || rating) >= star ? "fill-bronze text-bronze" : "text-ash/50"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="text-xs uppercase tracking-widest text-earth/60">{t("yourExperience")}</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                minLength={10}
                className="w-full bg-transparent border-b border-earth/20 focus:border-earth outline-none py-2 text-earth transition-colors resize-none"
                placeholder={t("reviewPlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-12 py-3 bg-earth text-cream uppercase tracking-widest text-sm font-semibold hover:bg-earth/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? t("submitting") : t("submitReview")}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-12">
          {reviews.length === 0 ? (
            <p className="text-earth/60 text-center italic py-8">
              {t("noReviews")}
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="space-y-4 border-b border-earth/10 pb-10 last:border-transparent last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium text-earth uppercase tracking-wider text-sm">{review.user.name || "Anonymous"}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= review.rating ? "fill-bronze text-bronze" : "text-ash/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-earth/50 uppercase tracking-widest">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-earth/80 font-serif text-base leading-relaxed italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
