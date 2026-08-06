import LoginForm from "@/components/auth/LoginForm";

function getSafeCallbackUrl(searchParams) {
  const callbackUrl = searchParams?.callbackUrl;

  if (typeof callbackUrl === "string" && callbackUrl.startsWith("/")) {
    return callbackUrl;
  }

  return "/";
}

export default function LoginPage({ searchParams }) {
  const callbackUrl = getSafeCallbackUrl(searchParams);

  return (
    <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <LoginForm callbackUrl={callbackUrl} />
    </main>
  );
}