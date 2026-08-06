import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none transition-colors",
	{
		variants: {
			variant: {
				default: "border-transparent bg-slate-900 text-white",
				secondary: "border-transparent bg-slate-100 text-slate-700",
				success: "border-transparent bg-emerald-100 text-emerald-700",
				warning: "border-transparent bg-amber-100 text-amber-700",
				destructive: "border-transparent bg-rose-100 text-rose-700",
				info: "border-transparent bg-sky-100 text-sky-700",
				outline: "border-slate-200 bg-white text-slate-700",
			},
		},
		defaultVariants: {
			variant: "secondary",
		},
	}
);

function Badge({ className, variant, ...props }) {
	return (
		<span
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
