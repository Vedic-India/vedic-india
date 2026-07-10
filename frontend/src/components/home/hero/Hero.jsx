import Container from "@/components/layout/Container";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import FeatureStrip from "./FeatureStrip";

export default function Hero() {
  return (
    <section className="relative bg-[rgb(221,234,248)] overflow-hidden">

      <Container>
        <div className="grid items-center gap-4 pt-8 lg:grid-cols-[1fr_1fr]">

          <HeroContent />

          <HeroImage />

        </div>
      </Container>

      <FeatureStrip />

    </section>
  );
}