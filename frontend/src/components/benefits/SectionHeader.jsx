export default function SectionHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">

      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="h-px w-16 bg-emerald-300" />

        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Why It Matters
        </span>

        <div className="h-px w-16 bg-emerald-300" />
      </div>

      <h2 className="font-serif text-4xl font-bold text-slate-900">
        Why Choose Alkaline Water?
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-500">
        Alkaline water supports your body's natural balance and helps you
        live a healthier, more active and energetic life.
      </p>

    </div>
  );
}