import { createProduct, getAdminProducts } from "../../../actions/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  const { products: allProducts } = await getAdminProducts();

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

      <NewProductForm allProducts={allProducts} handleSubmit={handleSubmit} />
    </div>
  );
}
