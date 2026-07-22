import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/hero/Hero";
import Footer from "@/components/layout/Footer";
import FeaturedProducts from "@/components/home/products/FeaturedProducts";
import Testimonials from "@/components/home/testimonials/Testimonials";
import BackgroundDecoration from "@/components/home/BackgroundDecoration";
import ScienceSection from "@/components/home/science/ScienceSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ScienceSection />
      <Testimonials />
    </>
  );
}