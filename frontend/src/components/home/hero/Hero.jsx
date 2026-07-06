import Container from "@/components/layout/Container";
import FloatingBackground from "./FloatingBackground";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import ScrollIndicator from "./ScrollIndicator";
import FeatureStrip from "./FeatureStrip";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden">

      <FloatingBackground />

      <Container>
        <div className="grid h-[640px] items-center gap-4 pt-20 lg:grid-cols-[1fr_1fr]">

          <HeroContent />

          <HeroImage />

        </div>
      </Container>

      <Container>
        <FeatureStrip />
      </Container>

      <ScrollIndicator />

    </section>
  );
}