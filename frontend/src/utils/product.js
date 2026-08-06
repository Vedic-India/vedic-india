const PRODUCT_PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect width='800' height='800' rx='48' fill='%23f8fafc'/%3E%3Cpath d='M168 256h464v288H168z' fill='%23e2e8f0'/%3E%3Cpath d='M232 320h336v160H232z' fill='%23ffffff'/%3E%3Cpath d='M352 344c0-26.51 21.49-48 48-48s48 21.49 48 48-21.49 48-48 48-48-21.49-48-48zm-72 200l104-104 72 72 64-64 88 88H280z' fill='%2394a3b8'/%3E%3C/svg%3E";

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const toSafeString = (value) =>
  isNonEmptyString(value) ? value.trim() : "";

const toSafeNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

const toSafeSlug = (value, fallback = "") => {
  const source = toSafeString(value) || toSafeString(fallback);

  if (!source) {
    return "";
  }

  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const normalizeImageEntry = (image) => {
  if (isNonEmptyString(image)) {
    return {
      url: image.trim(),
      publicId: null,
    };
  }

  if (!image || typeof image !== "object") {
    return null;
  }

  const url = normalizeProductImageUrl(
    image.url ?? image.src ?? image.image ?? image.path
  );

  if (!url) {
    return null;
  }

  return {
    ...image,
    url,
  };
};

export function normalizeProductImageUrl(image) {
  if (isNonEmptyString(image)) {
    return image.trim();
  }

  if (!image || typeof image !== "object") {
    return "";
  }

  return normalizeProductImageUrl(
    image.url ?? image.src ?? image.image ?? image.path
  );
}

export function getProductImageUrls(product) {
  const imageSources = [];

  if (Array.isArray(product?.images)) {
    imageSources.push(...product.images);
  }

  if (Array.isArray(product?.gallery)) {
    imageSources.push(...product.gallery);
  }

  imageSources.push(product?.image);

  const imageUrls = imageSources
    .flatMap((image) => {
      if (Array.isArray(image)) {
        return image;
      }

      const normalizedImage = normalizeImageEntry(image);

      return normalizedImage ? [normalizedImage.url] : [];
    })
    .filter((imageUrl) => isNonEmptyString(imageUrl));

  return Array.from(new Set(imageUrls));
}

export function normalizeProduct(product = {}) {
  const imageUrls = getProductImageUrls(product);
  const slug = toSafeSlug(product.slug, product.name || product._id);

  return {
    ...product,
    _id: toSafeString(product._id) || toSafeString(product.id) || slug,
    id: toSafeString(product.id) || toSafeString(product._id) || slug,
    slug,
    name: toSafeString(product.name) || "Untitled product",
    description: toSafeString(product.description),
    price: toSafeNumber(product.price),
    stock: toSafeNumber(product.stock),
    category: toSafeString(product.category),
    benefits: Array.isArray(product.benefits)
      ? product.benefits.filter(isNonEmptyString).map((benefit) => benefit.trim())
      : [],
    specifications:
      product.specifications && typeof product.specifications === "object" && !Array.isArray(product.specifications)
        ? product.specifications
        : {},
    images: imageUrls.map((url) => ({
      url,
      publicId: null,
    })),
    image: imageUrls[0] || PRODUCT_PLACEHOLDER_IMAGE,
    gallery: imageUrls,
    isActive:
      typeof product.isActive === "boolean"
        ? product.isActive
        : typeof product.active === "boolean"
        ? product.active
        : typeof product.status === "string"
        ? product.status.toLowerCase() === "active"
        : true,
  };
}

export function normalizeProducts(products = []) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map((product) => normalizeProduct(product));
}

export { PRODUCT_PLACEHOLDER_IMAGE };