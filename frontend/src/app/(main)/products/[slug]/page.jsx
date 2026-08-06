import ProductDetailsPage from "@/components/products/ProductDetailsPage";

export default async function ProductPage({ params }) {
  const { slug } = await params;

  return <ProductDetailsPage slug={slug} />;
}