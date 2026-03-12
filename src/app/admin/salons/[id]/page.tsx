import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, X, Building, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { approveSalonPartner, rejectSalonPartner, getBulkPricingTiers, updateSalonPricingTier } from "../../../actions/admin";

export default async function AdminSalonDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const salon = await prisma.salonPartner.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      pricingTier: true,
    }
  });

  const tiers = await getBulkPricingTiers();

  if (!salon) return notFound();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href="/admin/salons" className="text-xs font-semibold text-earth/50 hover:text-bronze flex items-center mb-4 uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Salons
        </Link>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-serif text-earth uppercase tracking-widest flex items-center gap-4">
                {salon.businessName}
                </h1>
                <p className="text-earth/60 mt-1 text-sm font-light">
                Application submitted on {new Date(salon.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div>
               {salon.isApproved ? (
                 <span className="bg-green-100 text-green-800 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm border border-green-200">Approved Partner</span>
               ) : (
                 <span className="bg-yellow-100 text-yellow-800 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm border border-yellow-200">Pending Review</span>
               )}
            </div>
        </div>
      </div>

      <div className="bg-cream border border-earth/10 p-8 space-y-8">
         <section>
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-earth/40 border-b border-earth/10 pb-2 mb-4">Business Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-earth">
                <div>
                   <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Business Name</p>
                   <p className="font-medium text-lg">{salon.businessName}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Pricing Tier</p>
                   <form action={async (formData: FormData) => {
                       "use server";
                       const tierId = formData.get("tierId") as string;
                       await updateSalonPricingTier(salon.id, tierId || null);
                   }} className="flex items-center gap-2">
                     <select name="tierId" defaultValue={salon.pricingTierId || ""} className="bg-sand border border-earth/20 rounded-sm px-2 py-1 text-xs text-earth focus:outline-none focus:border-bronze">
                        <option value="">No Tier (0% Discount)</option>
                        {tiers.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                     </select>
                     <Button type="submit" size="sm" className="px-3 py-1 h-auto text-[10px] uppercase tracking-widest">Update</Button>
                   </form>
                </div>
                <div className="md:col-span-2">
                   <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Location / Address</p>
                   <p>{salon.address}</p>
                </div>
             </div>
         </section>

         <section>
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-earth/40 border-b border-earth/10 pb-2 mb-4">Contact Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-earth">
                <div>
                   <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Contact Name</p>
                   <p>{salon.contactName}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Contact Email</p>
                   <p><a href={`mailto:${salon.contactEmail}`} className="text-bronze hover:underline">{salon.contactEmail}</a></p>
                </div>
                {salon.phone && (
                    <div>
                    <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Phone Number</p>
                    <p>{salon.phone}</p>
                    </div>
                )}
             </div>
         </section>

         <section>
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-earth/40 border-b border-earth/10 pb-2 mb-4">Social & Web</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-earth">
                {salon.instagramHandle && (
                    <div>
                    <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Instagram</p>
                    <p className="text-bronze">{salon.instagramHandle}</p>
                    </div>
                )}
                {(salon as any).socialMediaLinks && (
                    <div className="md:col-span-2">
                    <p className="text-[10px] uppercase text-earth/50 font-semibold mb-1">Website / Other Links</p>
                    <p className="break-all text-bronze">{(salon as any).socialMediaLinks}</p>
                    </div>
                )}
             </div>
         </section>

         {salon.message && (
             <section>
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-earth/40 border-b border-earth/10 pb-2 mb-4">Message / Additional Info</h3>
                 <p className="text-sm text-earth/80 whitespace-pre-wrap leading-relaxed p-4 bg-stone/30 italic">
                     "{salon.message}"
                 </p>
             </section>
         )}

         {salon.user && (
             <section className="mt-8 pt-6 border-t border-earth/10">
                 <Link href={`/admin/users/${salon.user.id}`} className="flex items-center gap-3 p-4 border border-earth/20 hover:bg-stone/30 transition-colors group">
                    <div className="w-10 h-10 bg-earth/10 flex items-center justify-center rounded-sm">
                        <UserIcon className="w-5 h-5 text-earth/60 group-hover:text-earth transition-colors" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-earth/50 mb-0.5">Linked User Account</p>
                        <p className="text-sm font-medium text-earth group-hover:text-bronze transition-colors">{salon.user.name} ({salon.user.email}) &rarr;</p>
                    </div>
                 </Link>
             </section>
         )}
      </div>

      {!salon.isApproved && (
        <div className="flex items-center gap-4 pt-6 border-t border-earth/20">
            <form action={async () => { "use server"; await approveSalonPartner(salon.id); }}>
                <Button type="submit" className="flex items-center gap-2 px-8 uppercase tracking-widest text-xs h-12">
                    <Check className="w-4 h-4" /> Approve Application
                </Button>
            </form>
            <form action={async () => { "use server"; await rejectSalonPartner(salon.id); }}>
                <Button type="submit" variant="secondary" className="flex items-center gap-2 px-8 uppercase tracking-widest text-xs h-12 border-red-200 text-red-600 hover:bg-red-50">
                    <X className="w-4 h-4" /> Reject
                </Button>
            </form>
        </div>
      )}
    </div>
  );
}
