import Image from "next/image";

export default function ProductCard({
  image,
  title,
  volume,
  price,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="bg-[#f8fbff] p-6">
        <Image
          src={image}
          alt={title}
          width={300}
          height={300}
          className="mx-auto h-60 w-auto object-contain"
        />
      </div>

      <div className="space-y-2 p-5">
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-sm text-gray-500">
          {volume}
        </p>

        <p className="text-2xl font-bold text-(--color-secondary)">
          ₹{price}
        </p>
      </div>

    </div>
  );
}