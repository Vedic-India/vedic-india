import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/hero/Hero";
import Footer from "@/components/layout/Footer";
import FeaturedProducts from "@/components/home/products/FeaturedProducts";
import BenefitsSection from "@/components/home/benefits/BenefitsSection";
import Testimonials from "@/components/home/testimonials/Testimonials";
import Newsletter from "@/components/home/newsletter/Newsletter";
import BackgroundDecoration from "@/components/home/BackgroundDecoration";

export default function Home() {
  return (
    <>
      <Navbar />
      <BackgroundDecoration />

      <main>
        <Hero />
        <FeaturedProducts />
        <BenefitsSection />
        <Testimonials />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}