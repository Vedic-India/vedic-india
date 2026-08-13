"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/layout/Container";
import PageLoader from "@/components/layout/PageLoader";
import { useAuth } from "@/context/AuthContext";

function AdminLayoutContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const query = searchParams.toString();
      const callbackUrl = `${pathname}${query ? `?${query}` : ""}`;
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, pathname, router, searchParams, user?.role]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return <PageLoader />;
  }

  return (
    <Container className="py-10 sm:py-12 lg:py-14">
      {children}
    </Container>
  );
}

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}