import {
  getAdminDiscountCodes,
  createDiscountCode,
  toggleDiscountCode,
  deleteDiscountCode,
} from "../../actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tag, Trash2, Power } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminDiscountsPage() {
  const codes = await getAdminDiscountCodes();

  async function handleCreate(formData: FormData) {
    "use server";
    const code = formData.get("code") as string;
    const discountPct = formData.get("discountPct")
      ? parseFloat(formData.get("discountPct") as string)
      : undefined;
    const discountFixed = formData.get("discountFixed")
      ? parseFloat(formData.get("discountFixed") as string)
      : undefined;
    const expiresAt = (formData.get("expiresAt") as string) || undefined;
    const allowedForSalon = formData.get("allowedForSalon") === "on";

    await createDiscountCode({ code, discountPct, discountFixed, expiresAt, allowedForSalon });
    redirect("/admin/discounts");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Discount Codes
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Create and manage promotional discount codes.
        </p>
      </div>

      {/* Create Form */}
      <div className="bg-cream border border-earth/10 p-6 space-y-6">
        <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2 flex items-center gap-2">
          <Tag className="h-5 w-5 text-bronze" />
          Create Discount Code
        </h2>

        <form action={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="code"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Code *
              </label>
              <Input
                id="code"
                name="code"
                required
                placeholder="e.g. SPRING2026"
                className="bg-sand border-earth/20 focus-visible:border-bronze uppercase"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="discountPct"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Discount % (leave blank for fixed)
              </label>
              <Input
                id="discountPct"
                name="discountPct"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="15"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="discountFixed"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Fixed Discount ₦ (leave blank for %)
              </label>
              <Input
                id="discountFixed"
                name="discountFixed"
                type="number"
                min="0"
                placeholder="5000"
                className="bg-sand border-earth/20 focus-visible:border-bronze"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="expiresAt"
                className="text-[10px] font-semibold tracking-widest uppercase text-earth"
              >
                Expiry Date (optional)
              </label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
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
            <span className="text-xs text-earth/80">Allow salon partners to use this code</span>
          </label>

          <Button type="submit" className="flex items-center gap-2">
            <Tag className="h-4 w-4" /> Create Code
          </Button>
        </form>
      </div>

      {/* Codes Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/10 pb-2">
          All Discount Codes
        </h2>

        {codes.length === 0 ? (
          <div className="bg-cream border border-earth/10 p-8 text-center text-earth/50 text-sm">
            No discount codes created yet.
          </div>
        ) : (
          <div className="bg-cream border border-earth/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-earth/10 bg-stone/30">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Expires
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
                {codes.map((code) => (
                  <tr
                    key={code.id}
                    className="border-b border-earth/5 hover:bg-stone/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-earth font-mono font-semibold text-xs">
                      {code.code}
                    </td>
                    <td className="py-3 px-4 text-earth/70 text-xs">
                      {code.discountPct ? "Percentage" : "Fixed Amount"}
                    </td>
                    <td className="py-3 px-4 text-earth font-medium text-xs">
                      {code.discountPct
                        ? `${code.discountPct}%`
                        : `₦ ${((code.discountFixed || 0) / 100).toLocaleString()}`}
                    </td>
                    <td className="py-3 px-4 text-earth/60 text-xs">
                      {code.expiresAt
                        ? new Date(code.expiresAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${code.allowedForSalon ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                        {code.allowedForSalon ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${
                          code.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {code.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <form
                          action={async () => {
                            "use server";
                            await toggleDiscountCode(code.id);
                          }}
                        >
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className={`px-2 ${
                              code.isActive
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
                            await deleteDiscountCode(code.id);
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
          </div>
        )}
      </div>
    </div>
  );
}
