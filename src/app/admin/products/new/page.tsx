import { createProduct } from "../../../actions/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { redirect } from "next/navigation";

export default function NewProductPage() {

  // We wrap the server action to handle redirects properly
  async function handleSubmit(formData: FormData) {
    "use server";
    await createProduct(formData);
    redirect("/admin/products");
  }

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="text-earth/60 hover:text-earth transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">New Regimen Offering</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">Add a new product to the catalog.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-12">
        <div className="bg-cream p-8 border border-earth/10 space-y-8 shadow-sm">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Core Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Product Name *</label>
                <Input id="name" name="name" required placeholder="e.g. Purifying Clay Wash" className="bg-sand border-earth/20 focus-visible:border-bronze" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ritualName" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Regimen Line</label>
                <Input id="ritualName" name="ritualName" placeholder="e.g. The Cleansing Regimen" className="bg-sand border-earth/20 focus-visible:border-bronze" />
              </div>
              <div className="space-y-2">
                <label htmlFor="functionalTitle" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Functional Subtitle</label>
                <Input id="functionalTitle" name="functionalTitle" placeholder="e.g. Deep Scalp Detox" className="bg-sand border-earth/20 focus-visible:border-bronze" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Pricing & Logistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label htmlFor="price" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Base Price (₦) *</label>
                <Input id="price" name="price" type="number" min="0" required placeholder="25000" className="bg-sand border-earth/20 focus-visible:border-bronze" />
              </div>
              <div className="space-y-2">
                <label htmlFor="size" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Variant Size / Volume</label>
                <Input id="size" name="size" placeholder="e.g. 250ml" className="bg-sand border-earth/20 focus-visible:border-bronze" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Poetry & Storytelling</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="description" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Main Description *</label>
                <textarea 
                  id="description" 
                  name="description"
                  required
                  rows={4}
                  className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Elevate your sensory experience..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="howToUse" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Usage Guide (How To)</label>
                <textarea 
                  id="howToUse" 
                  name="howToUse"
                  rows={3}
                  className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Apply generously to damp hair..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ingredientsText" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Key Ingredients</label>
                <textarea 
                  id="ingredientsText" 
                  name="ingredientsText"
                  rows={3}
                  className="flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Rhassoul Clay, Kalahari Melon Oil..."
                />
              </div>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end space-x-4">
           <Link href="/admin/products">
              <Button type="button" variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">Cancel</Button>
           </Link>
           <Button type="submit" className="flex items-center space-x-2">
             <Save className="h-4 w-4" />
             <span>Publish Offering</span>
           </Button>
        </div>
      </form>
    </div>
  );
}
