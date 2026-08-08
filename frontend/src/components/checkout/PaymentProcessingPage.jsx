"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import Container from "@/components/layout/Container";
import { useOrder } from "@/hooks/queries/useOrder";

function LoadingBlock() {
  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="mx-auto w-full max-w-3xl rounded-3xl bg-slate-200/80 animate-pulse" style={{ minHeight: "420px" }} />
      </Container>
    </section>
  );
}

export default function PaymentProcessingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const reason = searchParams.get("reason") || "";

  const { data: order, isLoading, isError, error } = useOrder(orderId);
  const orderNumber = useMemo(() => order?.orderNumber || orderId || "", [order, orderId]);

  if (orderId && isLoading) {
    return <LoadingBlock />;
  }

  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="mx-auto max-w-4xl space-y-6">
          <Card className="overflow-hidden">
            <div className="h-2 bg-[linear-gradient(90deg,#0084f4,var(--color-secondary))]" />

            <CardContent className="space-y-8 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-5">
                  <div className="flex size-18 items-center justify-center rounded-full bg-sky-50 text-sky-600 shadow-inner">
                    <Loader2 className="size-10 animate-spin" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">Processing</p>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Your payment is being confirmed.</h1>
                    <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      We couldn&apos;t confirm your payment immediately. Your payment may still be processing.
                      Please check your orders shortly.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:min-w-72">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order Status</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="info">Processing</Badge>
                    {order?.paymentInfo?.status ? <Badge variant="outline">{order.paymentInfo.status}</Badge> : null}
                  </div>

                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order Number</p>
                      <p className="mt-1 font-semibold text-slate-900">{orderNumber || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <CheckCircle2 className="size-5 text-(--color-secondary)" />
                  <p className="mt-4 text-sm font-semibold text-slate-900">Confirmation pending</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    The backend is still confirming whether the payment was captured successfully.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <ShoppingBag className="size-5 text-(--color-secondary)" />
                  <p className="mt-4 text-sm font-semibold text-slate-900">Check your orders</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your orders page will reflect the final status once confirmation arrives.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <Loader2 className="size-5 animate-spin text-(--color-secondary)" />
                  <p className="mt-4 text-sm font-semibold text-slate-900">Webhook safety net</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    The backend webhook can still confirm the payment even if this page loads first.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                {reason || "We are confirming your payment now."}
                {isError ? (
                  <span className="mt-2 block text-rose-600">
                    We could not load the latest order details right now. {error?.response?.data?.message || "Please check your orders shortly."}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild className="h-12 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-6 text-white shadow-sm hover:opacity-95">
                  <Link href="/account/orders">View My Orders</Link>
                </Button>

                <Button asChild variant="outline" className="h-12 rounded-full border-slate-200 px-6">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}