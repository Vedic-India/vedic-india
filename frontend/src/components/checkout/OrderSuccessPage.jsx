"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Package, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import Container from "@/components/layout/Container";
import { useOrder } from "@/hooks/queries/useOrder";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatOrderStatus(status) {
  if (!status) return "—";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPaymentMethod(method) {
  if (!method) return "—";

  if (method === "cod") {
    return "Cash on Delivery";
  }

  if (method === "razorpay") {
    return "Razorpay";
  }

  return method;
}

function getPaymentStatusBadge(paymentStatus) {
  if (!paymentStatus) {
    return null;
  }

  if (paymentStatus === "paid") {
    return { label: "Paid", variant: "success" };
  }

  if (paymentStatus === "failed") {
    return { label: "Payment Failed", variant: "destructive" };
  }

  if (paymentStatus === "refunded") {
    return { label: "Refunded", variant: "outline" };
  }

  return { label: "Payment Processing", variant: "info" };
}

function SuccessSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-3xl rounded-3xl bg-slate-200/80 animate-pulse"
      style={{ minHeight: "420px" }}
    />
  );
}

function getNextStepsState(paymentMethod, paymentStatus) {
  if (paymentMethod === "cod" || paymentStatus === "paid") {
    return {
      icon: CheckCircle2,
      iconClassName: "size-5 text-(--color-secondary)",
      description: "We'll keep you updated as your order moves through fulfilment.",
    };
  }

  return {
    icon: Loader2,
    iconClassName: "size-5 animate-spin text-(--color-secondary)",
    description: "We'll keep you updated as your order moves through fulfilment.",
  };
}

function getHeaderState(paymentMethod, paymentStatus) {
  if (paymentMethod === "cod") {
    return {
      icon: CheckCircle2,
      iconClassName: "size-10",
    };
  }

  if (paymentMethod === "razorpay" && paymentStatus === "paid") {
    return {
      icon: CheckCircle2,
      iconClassName: "size-10",
    };
  }

  return {
    icon: Loader2,
    iconClassName: "size-10 animate-spin",
  };
}

function UnavailableState({ title, heading, description, message, orderId }) {
  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="mx-auto max-w-4xl space-y-6">
          <Card className="overflow-hidden">
            <div className="h-2 bg-[linear-gradient(90deg,var(--color-secondary),var(--color-primary))]" />

            <CardContent className="space-y-8 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-5">
                  <div className="flex size-18 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-inner">
                    <AlertCircle className="size-10" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">{title}</p>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{heading}</h1>

                    <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:min-w-72">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="outline">Unavailable</Badge>
                  </div>

                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order Number</p>
                      <p className="mt-1 font-semibold text-slate-900">—</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Amount</p>
                      <p className="mt-1 font-semibold text-slate-900">—</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Payment Method</p>
                      <p className="mt-1 font-semibold capitalize text-slate-900">—</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                {message}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-12 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-6 text-white shadow-sm hover:opacity-95">
                  <Link href="/account/orders">View Orders</Link>
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

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { data: order, isLoading, isError, error } = useOrder(orderId);

  if (orderId && isLoading) {
    return (
      <section className="bg-slate-50 pt-30 pb-14">
        <Container>
          <SuccessSkeleton />
        </Container>
      </section>
    );
  }

  if (!orderId) {
    return (
      <UnavailableState
        title="Order Information Unavailable"
        heading="Order information is unavailable."
        description="We could not identify an order to display. You can still check your account orders or continue shopping."
        message="We could not identify an order to display. You can still view your orders from your account."
      />
    );
  }

  if (isError || !order) {
    return (
      <UnavailableState
        title="Order Details Unavailable"
        heading="We couldn't load your order details."
        description="We received your request, but we couldn't retrieve the latest order information right now. You can check your orders from your account."
        message={error?.response?.data?.message || "We could not load the latest order details right now. You can still view your orders from your account."}
      />
    );
  }

  const orderNumber = order?.orderNumber || "";
  const paymentStatus = order?.paymentInfo?.status;
  const paymentMethod = order?.paymentInfo?.method;
  const orderStatus = order?.orderStatus;
  const paymentBadge = getPaymentStatusBadge(paymentStatus);
  const orderStatusLabel = formatOrderStatus(orderStatus);
  const nextStepsState = getNextStepsState(paymentMethod, paymentStatus);
  const NextStepsIcon = nextStepsState.icon;
  const headerState = getHeaderState(paymentMethod, paymentStatus);
  const HeaderIcon = headerState.icon;

  const isRazorpayPaid = paymentMethod === "razorpay" && paymentStatus === "paid";
  const isCod = paymentMethod === "cod";
  const eyebrow = isRazorpayPaid || isCod ? "Order Placed Successfully" : "Order Received";
  const heading = isRazorpayPaid
    ? "Your payment is confirmed."
    : isCod
      ? "Your order has been confirmed."
      : "Your order has been received.";
  const description = isRazorpayPaid
    ? "Thanks for shopping with Vedic India. We have received your order and are preparing it for dispatch."
    : isCod
      ? "Thanks for shopping with Vedic India. Your order has been received and will be processed for fulfilment."
      : "Thanks for shopping with Vedic India. Your order is on record and we are confirming the latest status from the backend.";

  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="mx-auto max-w-4xl space-y-6">
          <Card className="overflow-hidden">
            <div className="h-2 bg-[linear-gradient(90deg,var(--color-secondary),var(--color-primary))]" />

            <CardContent className="space-y-8 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-5">

                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
                      {eyebrow}
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                      {heading}
                    </h1>

                    <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:min-w-72">

                  <div className="space-y-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order Number</p>
                      <p className="mt-1 font-semibold text-slate-900">{orderNumber || "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Amount</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order?.totalAmount != null ? formatCurrency(order.totalAmount) : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Payment Method</p>
                      <p className="mt-1 font-semibold capitalize text-slate-900">
                        {formatPaymentMethod(paymentMethod)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <Package className="size-5 text-(--color-secondary)" />
                  <p className="mt-4 text-sm font-semibold text-slate-900">Order received</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {isRazorpayPaid
                      ? "Your order has been placed in our system and is now awaiting fulfilment."
                      : isCod
                        ? "Your order has been placed and will be fulfilled once delivery processing begins."
                        : "Your order has been saved and will update once payment confirmation completes."}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <ShoppingBag className="size-5 text-(--color-secondary)" />
                  <p className="mt-4 text-sm font-semibold text-slate-900">Account updated</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your order and payment status are available in your account orders area.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <NextStepsIcon className={nextStepsState.iconClassName} />
                  <p className="mt-4 text-sm font-semibold text-slate-900">Next steps</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{nextStepsState.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-12 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-6 text-white shadow-sm hover:opacity-95">
                  <Link href={`/account/orders/${orderId}`}>View Order</Link>
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