export default function AuthLayout({ children }) {
  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-[#F5F7FA] px-4 py-6 sm:px-6">
      <div className="flex min-h-[calc(100dvh-3rem)] w-full min-w-0 items-center justify-center">
        {children}
      </div>
    </main>
  );
}