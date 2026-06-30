export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "left",
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : ""}`}>
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
          {badge}
        </span>
      )}

      <h2 className="font-heading text-3xl font-bold text-(--color-text) md:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-(--color-muted)">
          {subtitle}
        </p>
      )}
    </div>
  );
}