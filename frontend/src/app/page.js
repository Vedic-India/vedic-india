import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HeroFeatures from "@/components/home/HeroFeatures";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Footer from "@/components/layout/Footer";
import WhyChoose from "@/components/home/WhyChoose";
import Stats from "@/components/home/Stats";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <HeroFeatures />
        <FeaturedProducts />
        <WhyChoose />
        <Stats />
      </main>

      <Footer />
    </>
  );
}