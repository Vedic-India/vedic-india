import Container from "../layout/Container";

const stats = [
  {
    number: "20K+",
    label: "Happy Customers",
  },
  {
    number: "4",
    label: "Premium Products",
  },
  {
    number: "99%",
    label: "Customer Satisfaction",
  },
  {
    number: "24/7",
    label: "Customer Support",
  },
];

export default function Stats() {
  return (
    <section className="bg-[var(--color-primary)] py-20 text-white">
      <Container>
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <h2 className="text-5xl font-bold">
                {stat.number}
              </h2>

              <p className="mt-3 text-white/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}