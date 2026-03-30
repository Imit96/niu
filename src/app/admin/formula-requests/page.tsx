import { getCustomFormulaRequests, markFormulaRequestReviewed } from "@/app/actions/custom-formula";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { FlaskConical, CheckCircle, Clock } from "lucide-react";
import MarkReviewedButton from "./MarkReviewedButton";

export const metadata = {
  title: "Custom Formula Requests | ORIGONÆ Admin",
};

export const dynamic = "force-dynamic";

export default async function FormulaRequestsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const requests = await getCustomFormulaRequests();

  const pending = requests.filter((r: any) => !r.isReviewed);
  const reviewed = requests.filter((r: any) => r.isReviewed);

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
            Custom Formula Requests
          </h1>
          <p className="text-earth/60 mt-2 text-sm">
            {pending.length} pending · {reviewed.length} reviewed
          </p>
        </div>
        <FlaskConical className="h-7 w-7 text-earth/30 mt-1" />
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-earth/50 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Awaiting Review ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((req: any) => (
              <div
                key={req.id}
                className="bg-cream border border-bronze/30 ring-1 ring-bronze/10 p-6 space-y-4"
              >
                <RequestCard req={req} />
                <MarkReviewedButton id={req.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <div className="bg-cream border border-earth/10 p-10 text-center space-y-2">
          <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
          <p className="text-earth/60 text-sm">All formula requests have been reviewed.</p>
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-earth/50 flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5" />
            Reviewed ({reviewed.length})
          </h2>
          <div className="space-y-2">
            {reviewed.map((req: any) => (
              <div
                key={req.id}
                className="bg-cream border border-earth/10 p-6 opacity-60"
              >
                <RequestCard req={req} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RequestCard({ req }: { req: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">Name</p>
        <p className="text-sm text-earth font-medium">{req.name}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">Email</p>
        <a
          href={`mailto:${req.email}`}
          className="text-sm text-bronze hover:underline underline-offset-4"
        >
          {req.email}
        </a>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">Concern</p>
        <p className="text-sm text-earth">{req.hairConcern}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">Submitted</p>
        <p className="text-sm text-earth/70">
          {new Date(req.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      {(req.texture || req.notes) && (
        <div className="sm:col-span-2 lg:col-span-4 space-y-2">
          {req.texture && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">Texture / Type</p>
              <p className="text-sm text-earth/80">{req.texture}</p>
            </div>
          )}
          {req.notes && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">Notes</p>
              <p className="text-sm text-earth/80 whitespace-pre-wrap">{req.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
