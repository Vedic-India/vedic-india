import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
			<p className="text-sm uppercase tracking-[0.3em] text-(--color-muted)">404</p>
			<h1 className="font-heading text-4xl font-semibold text-(--color-text)">Page not found</h1>
			<p className="max-w-md text-sm text-(--color-muted)">
				The page you are looking for does not exist or has been moved.
			</p>
			<Link
				href="/"
				className="rounded-full bg-(--color-primary) px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
			>
				Go home
			</Link>
		</main>
	);
}
