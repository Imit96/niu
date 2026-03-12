import { getProductBySlug, updateProduct, getAdminProducts } from "../../../../actions/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  const { products: allProducts } = await getAdminProducts();
  
  if (!product) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateProduct(product!.id, formData);
    redirect("/admin/products");
  }

  // Pre-fill variant data (assuming single variant for now)
  const variant = product.variants[0];

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="text-earth/60 hover:text-earth transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Edit Regimen Offering</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">Update details for {product.name}.</p>
        </div>
      </div>

      <EditProductForm product={product} allProducts={allProducts} handleSubmit={handleSubmit} />
    </div>
  );
}
