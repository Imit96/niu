import {
  getAdminSalonApplications,
  approveSalonPartner,
  rejectSalonPartner,
} from "../../actions/admin";
import { Button } from "@/components/ui/Button";
import { Check, X, Building } from "lucide-react";
import Link from "next/link";

export default async function AdminSalonsPage() {
  const salons = await getAdminSalonApplications();

  const pending = salons.filter((s) => !s.isApproved);
  const approved = salons.filter((s) => s.isApproved);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Salon Partners
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Review salon partnership applications and manage approved partners.
        </p>
      </div>

      {/* Pending Applications */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/10 pb-2 flex items-center gap-2">
          Pending Applications
          {pending.length > 0 && (
            <span className="text-xs bg-bronze/10 text-bronze px-2 py-0.5 rounded-sm font-sans">
              {pending.length}
            </span>
          )}
        </h2>

        {pending.length === 0 ? (
          <div className="bg-cream border border-earth/10 p-8 text-center text-earth/50 text-sm">
            No pending applications.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pending.map((salon) => (
              <div
                key={salon.id}
                className="bg-cream border border-bronze/20 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone flex items-center justify-center rounded-sm">
                      <Building className="h-5 w-5 text-earth/40" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-earth">
                        <Link href={`/admin/salons/${salon.id}`} className="hover:text-bronze hover:underline underline-offset-4 transition-colors">
                           {salon.businessName}
                        </Link>
                      </h3>
                      <p className="text-xs text-earth/50">
                        Applied{" "}
                        {new Date(salon.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-earth/80">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">
                      Contact
                    </p>
                    <p>{salon.contactName || salon.user?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">
                      Email
                    </p>
                    <p className="text-xs break-all">
                      {salon.contactEmail || salon.user?.email || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">
                      Location
                    </p>
                    <p className="text-xs">{salon.address}</p>
                  </div>
                  {salon.phone && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">
                        Phone
                      </p>
                      <p className="text-xs">{salon.phone}</p>
                    </div>
                  )}
                  {salon.instagramHandle && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">
                        Instagram
                      </p>
                      <p className="text-xs">{salon.instagramHandle}</p>
                    </div>
                  )}
                  {(salon as any).socialMediaLinks && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">
                        Website / Other
                      </p>
                      <p className="text-xs break-all">{(salon as any).socialMediaLinks}</p>
                    </div>
                  )}
                </div>

                {salon.message && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-earth/50 mb-1">
                      Message
                    </p>
                    <p className="text-sm text-earth/70 leading-relaxed">
                      {salon.message}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <form
                    action={async () => {
                      "use server";
                      await approveSalonPartner(salon.id);
                    }}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      className="flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await rejectSalonPartner(salon.id);
                    }}
                  >
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </form>
                  <Link href={`/admin/salons/${salon.id}`} className="ml-auto text-[10px] uppercase font-bold tracking-widest text-earth/50 hover:text-bronze">
                     View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Partners */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/10 pb-2">
          Approved Partners
        </h2>

        {approved.length === 0 ? (
          <div className="bg-cream border border-earth/10 p-8 text-center text-earth/50 text-sm">
            No approved partners yet.
          </div>
        ) : (
          <div className="bg-cream border border-earth/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-earth/10 bg-stone/30">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Business
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Pricing Tier
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Approved
                  </th>
                </tr>
              </thead>
              <tbody>
                {approved.map((salon) => (
                  <tr
                    key={salon.id}
                    className="border-b border-earth/5 hover:bg-stone/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-earth font-medium">
                      <Link href={`/admin/salons/${salon.id}`} className="hover:text-bronze hover:underline underline-offset-4 transition-colors">
                         {salon.businessName}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-earth/70 text-xs">
                      {salon.contactName || salon.user?.name || "—"}
                      <br />
                      {salon.contactEmail || salon.user?.email || "—"}
                    </td>
                    <td className="py-3 px-4 text-earth/60 text-xs">
                      {salon.address}
                    </td>
                    <td className="py-3 px-4 text-earth/60 text-xs">
                      {salon.pricingTier?.name || "Standard"}
                    </td>
                    <td className="py-3 px-4 text-earth/60 text-xs">
                      {new Date(salon.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
