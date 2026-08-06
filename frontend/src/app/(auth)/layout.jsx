export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      {children}
    </main>
  );
}