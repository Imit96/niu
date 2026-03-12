import { getAdminShippingRates, toggleShippingRate } from "@/app/actions/shipping";
import { AddRateForm } from "./AddRateForm";
import { DeleteRateButton } from "./DeleteRateButton";
import { Truck } from "lucide-react";

export default async function AdminShippingRatesPage() {
  const rates = await getAdminShippingRates();

  const domestic = rates.filter(r => r.type === "domestic");
  const international = rates.filter(r => r.type === "international");

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest flex items-center gap-3">
          <Truck className="h-7 w-7 text-bronze" />
          Shipping Rates
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Set delivery fees by state (Nigeria) and for international orders. These appear at checkout.
        </p>
      </div>

      <AddRateForm />

      {/* Domestic Rates */}
      <div className="bg-cream border border-earth/10 p-6 space-y-4">
        <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Nigeria (Domestic)</h2>
        {domestic.length === 0 ? (
          <p className="text-sm text-earth/50">No domestic rates configured yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-earth">
              <thead>
                <tr className="border-b border-earth/10 text-[10px] uppercase tracking-widest text-earth/60">
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">State / Region</th>
                  <th className="text-left py-2 pr-4">Rate (₦)</th>
                  <th className="text-left py-2 pr-4">Est. Delivery</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth/5">
                {domestic.map(rate => (
                  <tr key={rate.id}>
                    <td className="py-3 pr-4 font-medium">{rate.name}</td>
                    <td className="py-3 pr-4 text-earth/70">
                      {rate.region || <span className="italic text-earth/40">All states (default)</span>}
                    </td>
                    <td className="py-3 pr-4">₦{(rate.rateInCents / 100).toLocaleString()}</td>
                    <td className="py-3 pr-4 text-earth/70">{rate.estimatedDays || "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold ${rate.isActive ? "bg-green-100 text-green-700" : "bg-earth/10 text-earth/50"}`}>
                        {rate.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-3">
                      <form action={toggleShippingRate.bind(null, rate.id)} className="inline">
                        <button type="submit" className="text-xs text-bronze hover:text-earth transition-colors uppercase tracking-widest">
                          {rate.isActive ? "Disable" : "Enable"}
                        </button>
                      </form>
                      <DeleteRateButton id={rate.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* International Rates */}
      <div className="bg-cream border border-earth/10 p-6 space-y-4">
        <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">International</h2>
        {international.length === 0 ? (
          <p className="text-sm text-earth/50">No international rate configured yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-earth">
              <thead>
                <tr className="border-b border-earth/10 text-[10px] uppercase tracking-widest text-earth/60">
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">Rate (₦)</th>
                  <th className="text-left py-2 pr-4">Est. Delivery</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth/5">
                {international.map(rate => (
                  <tr key={rate.id}>
                    <td className="py-3 pr-4 font-medium">{rate.name}</td>
                    <td className="py-3 pr-4">₦{(rate.rateInCents / 100).toLocaleString()}</td>
                    <td className="py-3 pr-4 text-earth/70">{rate.estimatedDays || "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold ${rate.isActive ? "bg-green-100 text-green-700" : "bg-earth/10 text-earth/50"}`}>
                        {rate.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-3">
                      <form action={toggleShippingRate.bind(null, rate.id)} className="inline">
                        <button type="submit" className="text-xs text-bronze hover:text-earth transition-colors uppercase tracking-widest">
                          {rate.isActive ? "Disable" : "Enable"}
                        </button>
                      </form>
                      <DeleteRateButton id={rate.id} />
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
