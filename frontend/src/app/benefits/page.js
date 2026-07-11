import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BenefitsSection from "@/components/benefits/BenefitsSection";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <BenefitsSection />
      </main>

      <Footer />
    </>
  );
}