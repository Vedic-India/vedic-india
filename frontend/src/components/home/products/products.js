export const products = [
  {
    id: 1,
    name: "Alkaline PET Bottle",
    slug: "alkaline-pet-bottle",
    volume: "800 ml",
    price: "₹1,399",
    image: "/products/pet-bottle.jpeg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Alkaline Glass Bottle",
    slug: "alkaline-glass-bottle",
    volume: "450 ml",
    price: "₹1,499",
    image: "/products/glass-bottle.jpeg",
  },
  {
    id: 3,
    name: "Alkaline Water Drops",
    slug: "alkaline-water-drops",
    volume: "100 ml",
    price: "₹2,999",
    image: "/products/drops.jpeg",
  },
  {
    id: 4,
    name: "Alkaline Water Machine",
    slug: "alkaline-water-machine",
    volume: "Home System",
    price: "₹24,999",
    image: "/products/machine.jpeg",
  },
];

export const getProductVolumeBySlug = (slug) => {
  if (!slug) {
    return "";
  }

  const matchedProduct = products.find((product) => product.slug === slug);

  return matchedProduct?.volume ?? "";
};