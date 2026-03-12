import {
  getFlashSales,
  createFlashSale,
  toggleFlashSale,
  deleteFlashSale,
} from "../../actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Zap, Trash2, Power } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminFlashSalesPage() {
  const sales = await getFlashSales();

  async function handleCreate(formData: FormData) {
    "use server";
    await createFlashSale({
      title: formData.get("title") as string,
      discountPct: formData.get("discountPct")
        ? parseFloat(formData.get("discountPct") as string)
        : undefined,
      startsAt: formData.get("startsAt") as string,
      endsAt: formData.get("endsAt") as string,
      allowedForSalon: formData.get("allowedForSalon") === "on",
    });
    redirect("/admin/flash-sales");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Flash Sales
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Create and manage flash sales. Only one sale can be active at a time. Active sales display a banner above the navbar.
        </p>
      </div>

      {/* Create New Sale Form */}
      <div className="bg-cream border border-earth/10 p-6 space-y-6">
        <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-bronze" />
          Launch New Flash Sale
        </h2>

        <form action={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="title"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Banner Title *
              </label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. Spring Sale — 30% Off All Regimens"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="discountPct"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Discount Percentage
              </label>
              <Input
                id="discountPct"
                name="discountPct"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="30"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="startsAt"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Starts At *
              </label>
              <Input
                id="startsAt"
                name="startsAt"
                type="datetime-local"
                required
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="endsAt"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Ends At *
              </label>
              <Input
                id="endsAt"
                name="endsAt"
                type="datetime-local"
                required
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="allowedForSalon"
              defaultChecked
              className="w-4 h-4 accent-bronze"
            />
            <span className="text-xs text-earth/80">Allow salon partners to benefit from this sale</span>
          </label>

          <Button type="submit" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Launch Sale
          </Button>
        </form>
      </div>

      {/* Existing Sales */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/10 pb-2">
          All Flash Sales
        </h2>

        {sales.length === 0 ? (
          <div className="bg-cream border border-earth/10 p-8 text-center text-earth/50 text-sm">
            No flash sales created yet.
          </div>
        ) : (
          <div className="bg-cream border border-earth/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-earth/10 bg-stone/30">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Discount
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Period
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Salon
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => {
                  const now = new Date();
                  const isLive =
                    sale.isActive &&
                    new Date(sale.startsAt) <= now &&
                    new Date(sale.endsAt) >= now;

                  return (
                    <tr
                      key={sale.id}
                      className={`border-b border-earth/5 hover:bg-stone/20 transition-colors ${
                        isLive ? "bg-green-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-earth font-medium">
                        {sale.title}
                      </td>
                      <td className="py-3 px-4 text-earth/70">
                        {sale.discountPct ? `${sale.discountPct}%` : "—"}
                      </td>
                      <td className="py-3 px-4 text-earth/60 text-xs">
                        {new Date(sale.startsAt).toLocaleDateString()} →{" "}
                        {new Date(sale.endsAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${sale.allowedForSalon ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                          {sale.allowedForSalon ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm bg-green-100 text-green-800">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Live
                          </span>
                        ) : sale.isActive ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm bg-yellow-100 text-yellow-800">
                            Scheduled
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <form
                            action={async () => {
                              "use server";
                              await toggleFlashSale(sale.id);
                            }}
                          >
                            <Button
                              type="submit"
                              size="sm"
                              variant="ghost"
                              className={`px-2 ${
                                sale.isActive
                                  ? "text-yellow-600 hover:bg-yellow-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await deleteFlashSale(sale.id);
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
