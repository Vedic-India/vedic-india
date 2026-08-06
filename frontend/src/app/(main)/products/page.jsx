import ProductsHero from "@/components/products/ProductsHero";
import ProductsGrid from "@/components/products/ProductsGrid";

export default function ProductsPage() {
  return (
    <>
      <main className="bg-slate-50 pt-22">
        <ProductsHero />
        <ProductsGrid />
      </main>
    </>
  );
}