import { getArticleById, updateArticle } from "@/app/actions/article";
import { getAdminProducts } from "@/app/actions/product";
import { redirect } from "next/navigation";
import ArticleForm from "../../ArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await getArticleById(resolvedParams.id);
  const { products } = await getAdminProducts();

  if (!article) {
    redirect("/admin/articles");
  }

  async function actionUpdate(formData: FormData) {
    "use server";

    await updateArticle(article!.id, {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      featuredImage: (formData.get("featuredImage") as string) || null,
      mediaUrl: (formData.get("mediaUrl") as string) || null,
      isFeatured: formData.get("isFeatured") === "on",
      relatedProductId: (formData.get("relatedProductId") as string) || null,
    });

    redirect("/admin/articles");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 min-h-screen pb-12">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Edit Article</h1>
        <p className="text-earth/60 mt-1 text-sm font-light">Update an existing journal entry.</p>
      </div>
      <ArticleForm article={article} products={products} handleSubmit={actionUpdate} />
    </div>
  );
}
