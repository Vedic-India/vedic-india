import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-16">
      <Container>
        <div className="text-center">
          <h3 className="font-heading text-2xl font-bold">
            Vedic India
          </h3>

          <p className="mt-3 text-(--color-muted)">
            India's First Magnetized Alkaline Water Solutions
          </p>

          <p className="mt-10 text-sm text-(--color-muted)">
            © {new Date().getFullYear()} Vedic India. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}