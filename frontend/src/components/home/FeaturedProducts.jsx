import ProductCard from "../ui/ProductCard";
import Container from "../layout/Container";
import SectionHeading from "../layout/SectionHeading";

const products = [
  {
    title: "Alkaline PET Bottle",
    volume: "500 ml",
    price: 99,
    image: "/products/pet-bottle.jpeg",
  },
  {
    title: "Alkaline Glass Bottle",
    volume: "750 ml",
    price: 699,
    image: "/products/glass-bottle.jpeg",
  },
  {
    title: "Alkaline Water Drops",
    volume: "30 ml",
    price: 499,
    image: "/products/drops.jpeg",
  },
  {
    title: "Alkaline Water Machine",
    volume: "Home System",
    price: 14999,
    image: "/products/machine.jpeg",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#f8fbff] py-24">
      <Container>

        <SectionHeading
          badge="Our Products"
          title="Pure. Premium. Powerful."
          subtitle="Discover our premium range of alkaline water solutions designed to improve your everyday hydration."
          align="center"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.title}
              {...product}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}