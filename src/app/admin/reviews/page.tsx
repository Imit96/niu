import {
  getAdminReviews,
  approveReview,
  featureReview,
  deleteReview,
} from "../../actions/admin";
import { Button } from "@/components/ui/Button";
import { Check, Trash2, Star, StarOff } from "lucide-react";

type ReviewRow = Awaited<ReturnType<typeof getAdminReviews>>[number] & { isFeatured: boolean };

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews() as ReviewRow[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Reviews
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Moderate customer reviews before they appear on product pages.
        </p>
      </div>

      <div className="bg-cream border border-earth/10 overflow-x-auto">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-earth/50 text-sm">
            No reviews submitted yet.
          </div>
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-earth/10 bg-stone/30">
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Rating
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Comment
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Homepage
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className={`border-b border-earth/5 hover:bg-stone/20 transition-colors ${
                    !review.isApproved ? "bg-yellow-50/50" : ""
                  }`}
                >
                  <td className="py-3 px-4 text-earth font-medium">
                    {review.product.name}
                  </td>
                  <td className="py-3 px-4 text-earth/70 text-xs">
                    {review.user.name || review.user.email}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-bronze text-bronze"
                              : "text-earth/20"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-earth/70 text-xs max-w-[200px] truncate">
                    {review.comment || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${
                        review.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {review.isApproved ? (
                      <form
                        action={async () => {
                          "use server";
                          await featureReview(review.id, !review.isFeatured);
                        }}
                      >
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          title={review.isFeatured ? "Remove from homepage" : "Feature on homepage"}
                          className={`px-2 ${review.isFeatured ? "text-bronze hover:bg-bronze/10" : "text-earth/30 hover:text-bronze hover:bg-bronze/10"}`}
                        >
                          {review.isFeatured ? (
                            <Star className="h-4 w-4 fill-bronze" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                      </form>
                    ) : (
                      <span className="text-[10px] text-earth/30 italic px-2">Approve first</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {!review.isApproved && (
                        <form
                          action={async () => {
                            "use server";
                            await approveReview(review.id);
                          }}
                        >
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50 px-2"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                      <form
                        action={async () => {
                          "use server";
                          await deleteReview(review.id);
                        }}
                      >
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
