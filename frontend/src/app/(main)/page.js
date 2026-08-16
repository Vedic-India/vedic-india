import Hero from "@/components/home/hero/Hero";
import FeaturedProducts from "@/components/home/products/FeaturedProducts";
import Testimonials from "@/components/home/testimonials/Testimonials";
import ScienceSection from "@/components/home/science/ScienceSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ScienceSection />
      {/* <Testimonials /> */}
    </>
  );
}