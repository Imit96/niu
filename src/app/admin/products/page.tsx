import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import { getAdminProducts, deleteProduct } from "../../actions/product";
import { Button } from "@/components/ui/Button";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { products, totalPages } = await getAdminProducts(page);

  return (
    <div className="space-y-8 min-h-screen pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Products</h1>
          <p className="text-earth/60 mt-1 text-sm font-light">Manage your store catalog and inventory.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Product</span>
          </Button>
        </Link>
      </div>

      <div className="bg-cream border border-earth/10 overflow-hidden shadow-sm">
        <ul className="divide-y divide-earth/10">
          {products.length === 0 ? (
            <li className="p-8 text-center text-earth/50">
              No products found. Start by creating your first regimen offering.
            </li>
          ) : (
             products.map((product) => (
              <li key={product.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-stone/50 transition-colors">
                <div className="flex items-center space-x-6 w-full md:w-auto">
                  <div className="h-16 w-16 bg-stone flex-shrink-0 flex items-center justify-center border border-earth/10 overflow-hidden relative">
                    {product.images?.[0] && product.images[0] !== "Product Image Placeholder" ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest text-earth/40 text-center px-2">Image</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif text-earth">{product.name}</h3>
                    <p className="text-xs font-semibold tracking-widest uppercase text-bronze">{product.ritualName || "General"}</p>
                    <p className="text-sm text-earth/60 line-clamp-1 max-w-md">{product.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6 md:mt-0 w-full md:w-auto justify-end">
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium text-earth">
                      ₦ {((product.variants[0]?.priceInCents || 0) / 100).toLocaleString()}
                    </p>
                    <p className="text-xs text-earth/50 uppercase tracking-widest">{product.variants[0]?.inventoryCount || 0} in stock</p>
                  </div>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="secondary" size="sm" className="px-3 border-earth text-earth hover:bg-earth hover:text-cream">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <form action={async () => {
                     "use server";
                     await deleteProduct(product.id);
                  }}>
                    <Button type="submit" variant="secondary" size="sm" className="px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {page > 1 && (
            <Link href={`/admin/products?page=${page - 1}`} className="text-xs uppercase tracking-widest text-earth/60 hover:text-earth border border-earth/20 px-3 py-1">
              Previous
            </Link>
          )}
          <span className="text-xs text-earth/50">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/products?page=${page + 1}`} className="text-xs uppercase tracking-widest text-earth/60 hover:text-earth border border-earth/20 px-3 py-1">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
