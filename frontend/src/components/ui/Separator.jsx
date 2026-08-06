import { cn } from "@/lib/utils";

function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <div
      data-slot="separator"
      aria-hidden="true"
      className={cn(
        orientation === "vertical"
          ? "h-full w-px shrink-0 bg-slate-200"
          : "h-px w-full bg-slate-200",
        className
      )}
      {...props}
    />
  );
}

export { Separator };