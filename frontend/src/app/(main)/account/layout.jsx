"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/layout/Container";
import PageLoader from "@/components/layout/PageLoader";
import { useAuth } from "@/context/AuthContext";

export default function AccountLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const query = searchParams.toString();
      const callbackUrl = `${pathname}${query ? `?${query}` : ""}`;

      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router, searchParams]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  return (
    <Container className="py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl">
        {children}
      </div>
    </Container>
  );
}