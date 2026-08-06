import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
	return (
		<div
			data-slot="card"
			className={cn(
				"rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_60px_-36px_rgba(15,23,42,0.28)]",
				className
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }) {
	return (
		<div
			data-slot="card-header"
			className={cn("flex flex-col gap-1.5 p-6 sm:p-7", className)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }) {
	return (
		<h3
			data-slot="card-title"
			className={cn(
				"text-lg font-semibold tracking-tight text-slate-900",
				className
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }) {
	return (
		<p
			data-slot="card-description"
			className={cn("text-sm leading-6 text-slate-500", className)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6 pb-6 sm:px-7 sm:pb-7", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"flex items-center px-6 pb-6 pt-0 sm:px-7 sm:pb-7",
				className
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
};
