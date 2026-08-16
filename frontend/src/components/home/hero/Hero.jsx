import Container from "@/components/layout/Container";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import FeatureStrip from "./FeatureStrip";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[rgb(221,234,248)]">
      <Container>
        <div className="grid items-center gap-0 pt-4 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:pt-8">
          <HeroContent />

          <div className="relative -mx-4 w-[calc(100%+2rem)] mt-4 lg:mx-0 lg:mt-0 lg:w-full">
            <HeroImage />
          </div>
        </div>
      </Container>

      <FeatureStrip />
    </section>
  );
}