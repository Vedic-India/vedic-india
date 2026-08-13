"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Info, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import Container from "@/components/layout/Container";
import { useOrder } from "@/hooks/queries/useOrder";

function LoadingBlock() {
  return (
    <div
      className="mx-auto w-full max-w-3xl animate-pulse rounded-3xl bg-slate-200/80"
      style={{ minHeight: "420px" }}
    />
  );
}

function normalizeStatus(status) {
  return status === "not-completed" ? "not-completed" : "failed";
}

function getCopy(status) {
  if (status === "not-completed") {
    return {
      title: "Payment Not Completed",
      badge: "Not completed",
      description:
        "The Razorpay window was closed before the payment was confirmed.",
      helper:
        "Go back to your cart when you are ready. Starting again creates a fresh checkout.",
      icon: ShoppingBag,
    };
  }

  return {
    title: "Payment Failed",
    badge: "Failed",
    description:
      "Razorpay reported that the payment could not be completed.",
    helper:
      "Go back to your cart to begin a new checkout, or continue shopping if you want to review items first.",
    icon: AlertCircle,
  };
}

function getPaymentStatusNote(paymentStatus) {
  if (!paymentStatus) {
    return null;
  }

  if (paymentStatus === "pending") {
    return "Payment confirmation is still being processed.";
  }

  if (paymentStatus === "paid") {
    return "Our records show that this payment was successfully confirmed.";
  }

  if (paymentStatus === "refunded") {
    return "Our records show that this payment was refunded.";
  }

  if (paymentStatus === "failed") {
    return "Our records show that this payment failed.";
  }

  return "This is the current payment status from our records.";
}

function getBackendStatusBadge(paymentStatus) {
  if (!paymentStatus) {
    return null;
  }

  if (paymentStatus === "paid") {
    return {
      label: "Paid",
      variant: "success",
    };
  }

  if (paymentStatus === "pending") {
    return {
      label: "Processing",
      variant: "info",
    };
  }

  if (paymentStatus === "failed") {
    return {
      label: "Failed",
      variant: "destructive",
    };
  }

  if (paymentStatus === "refunded") {
    return {
      label: "Refunded",
      variant: "outline",
    };
  }

  return {
    label: paymentStatus,
    variant: "outline",
  };
}

function UnavailableState() {
  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden">
            <div className="h-2 bg-[linear-gradient(90deg,#ef4444,var(--color-primary))]" />

            <CardContent className="space-y-8 p-6 sm:p-8">
              <div className="max-w-2xl space-y-5">
                <div className="flex size-18 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-inner">
                  <AlertCircle className="size-10" />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
                    Order Information Unavailable
                  </p>

                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    We couldn&apos;t identify the order.
                  </h1>

                  <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    We could not identify the order associated with this
                    payment attempt. You can check your orders or return to
                    your cart.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
                No order ID was provided, so the latest payment status could
                not be retrieved.
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  className="h-12 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-6 text-white shadow-sm hover:opacity-95"
                >
                  <Link href="/cart">Back to Cart</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-slate-200 px-6"
                >
                  <Link href="/account/orders">View My Orders</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-slate-200 px-6"
                >
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <PaymentFailedPageContent />
    </Suspense>
  );
}

function PaymentFailedPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = normalizeStatus(searchParams.get("status") || "failed");
  const orderId = searchParams.get("orderId") || "";
  const reason = searchParams.get("reason") || "";

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useOrder(orderId);

  const copy = getCopy(status);
  const Icon = copy.icon;

  const paymentStatus = order?.paymentInfo?.status || "";
  const paymentStatusNote = getPaymentStatusNote(paymentStatus);
  const backendStatusBadge = getBackendStatusBadge(paymentStatus);

  /*
   * Backend payment state is authoritative.
   *
   * If payment was actually successful, this page should never
   * continue presenting it as failed.
   */
  useEffect(() => {
    if (!orderId || isLoading || isError || !order) {
      return;
    }

    if (paymentStatus === "paid") {
      router.replace(
        `/order-success?orderId=${encodeURIComponent(orderId)}`
      );
      return;
    }

    if (paymentStatus === "pending") {
      router.replace(
        `/payment-processing?orderId=${encodeURIComponent(orderId)}`
      );
    }
  }, [
    orderId,
    isLoading,
    isError,
    order,
    paymentStatus,
    router,
  ]);

  if (orderId && isLoading) {
    return (
      <section className="bg-slate-50 pt-30 pb-14">
        <Container>
          <LoadingBlock />
        </Container>
      </section>
    );
  }

  if (!orderId) {
    return <UnavailableState />;
  }

  /*
   * If the backend says paid/pending, the redirect effect above
   * will move the user to the correct page.
   *
   * Avoid rendering a misleading failure state during that transition.
   */
  if (!isError && order && (paymentStatus === "paid" || paymentStatus === "pending")) {
    return (
      <section className="bg-slate-50 pt-30 pb-14">
        <Container>
          <LoadingBlock />
        </Container>
      </section>
    );
  }

  const isNotCompleted = status === "not-completed";
  const showUncertainConfirmation =
    isNotCompleted && !paymentStatus;

  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden">
            <div
              className={
                isNotCompleted
                  ? "h-2 bg-[linear-gradient(90deg,#d6b14a,var(--color-secondary))]"
                  : "h-2 bg-[linear-gradient(90deg,#ef4444,var(--color-primary))]"
              }
            />

            <CardContent className="space-y-8 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-5">
                  <div
                    className={
                      isNotCompleted
                        ? "flex size-18 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-inner"
                        : "flex size-18 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-inner"
                    }
                  >
                    <Icon className="size-10" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
                      {copy.badge}
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                      {copy.title}
                    </h1>

                    <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      {copy.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:min-w-72">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Payment Status
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        isNotCompleted ? "warning" : "destructive"
                      }
                    >
                      {copy.badge}
                    </Badge>

                    {backendStatusBadge ? (
                      <Badge variant={backendStatusBadge.variant}>
                        {backendStatusBadge.label}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Order Number
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {order?.orderNumber || orderId || "—"}
                      </p>
                    </div>

                    {reason ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          Reason
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {reason}
                        </p>
                      </div>
                    ) : null}

                    {paymentStatusNote ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-600">
                        {paymentStatusNote}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <Info className="size-5 text-(--color-secondary)" />

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    No automatic retry
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Start a new checkout from your cart if you want to try
                    again.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <ShoppingBag className="size-5 text-(--color-secondary)" />

                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Keep shopping
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    You can review your orders or continue browsing products.
                  </p>
                </div>

                {showUncertainConfirmation ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <AlertCircle className="size-5 text-(--color-secondary)" />

                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      Confirmation may still arrive
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      If your payment was completed, the backend may still
                      receive confirmation independently.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <AlertCircle className="size-5 text-(--color-secondary)" />

                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      Start a fresh checkout
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      You can return to your cart and create a new payment
                      attempt whenever you are ready.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                {copy.helper}

                {isError ? (
                  <span className="mt-2 block text-rose-600">
                    We could not load the latest order details right now.{" "}
                    {error?.response?.data?.message ||
                      "Please check again shortly."}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  className="h-12 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-6 text-white shadow-sm hover:opacity-95"
                >
                  <Link href="/cart">Back to Cart</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-slate-200 px-6"
                >
                  <Link href="/account/orders">View My Orders</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-slate-200 px-6"
                >
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