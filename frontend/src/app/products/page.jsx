import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProductsHero from "@/components/products/ProductsHero";
import ProductsGrid from "@/components/products/ProductsGrid";

export default function ProductsPage() {
  return (
    <>
      <main className="pt-[88px] bg-slate-50">
        <ProductsHero />
        <ProductsGrid />
      </main>
    </>
  );
}