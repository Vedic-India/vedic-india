"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { queryKeys } from "@/constants/queryKeys";
import { useCart } from "@/hooks/queries/useCart";
import { useCreateOrder } from "@/hooks/mutations/useCreateOrder";
import { verifyPayment } from "@/services/order.service";
import { addAddress } from "@/services/user.service";
import { openRazorpayCheckout } from "@/services/payment.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import PageLoader from "@/components/layout/PageLoader";
import Container from "@/components/layout/Container";
import AddressFormDialog, { defaultAddressValues } from "@/components/account/AddressFormDialog";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  {
    value: "razorpay",
    title: "Online Payment (Recommended)",
    subtitle: "UPI • Credit/Debit Cards • Net Banking • Wallets",
    helper: "Powered by Razorpay",
    icon: CreditCard,
  },
  {
    value: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay when your order is delivered",
    helper: "",
    icon: Truck,
  },
];

function getDisplayPrice(item) {
  return Number(item?.currentPrice ?? item?.priceAtAdd ?? item?.price ?? 0);
}

function getItemSubtotal(item) {
  return getDisplayPrice(item) * Number(item?.quantity ?? 0);
}

function getWarningMessage(items, hasUnavailableItems) {
  const hasOutOfStockItems = items.some(
    (item) => !item.deleted && Number(item.stock ?? 0) === 0
  );
  const hasInsufficientStockItems = items.some(
    (item) =>
      !item.deleted &&
      Number(item.stock ?? 0) > 0 &&
      Number(item.quantity ?? 0) > Number(item.stock ?? 0)
  );

  if (hasUnavailableItems) {
    return "Some items in your cart are unavailable. Please remove or update them before placing the order.";
  }

  if (hasOutOfStockItems) {
    return "Some items in your cart are out of stock.";
  }

  if (hasInsufficientStockItems) {
    return "Some items exceed the available stock.";
  }

  return "";
}

function getFullAddress(address) {
  return [address?.addressLine1, address?.addressLine2].filter(Boolean).join(", ");
}

function getAddressCityLine(address) {
  return [address?.city, address?.state, address?.pincode].filter(Boolean).join(", ");
}

function getAddressSignature(address) {
  if (!address) return "";

  return JSON.stringify({
    fullName: address.fullName || "",
    phone: address.phone || "",
    addressLine1: address.addressLine1 || "",
    addressLine2: address.addressLine2 || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    country: address.country || "India",
    isDefault: !!address.isDefault,
  });
}

function EmptyCartState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shadow-inner">
        <Package className="size-8" />
      </div>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
        Your cart is empty
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        Add products to continue to checkout.
      </p>

      <Button asChild className="mt-8 h-11 rounded-full px-6">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <Skeleton className="h-36 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>

          <Skeleton className="h-168 w-full rounded-3xl" />
        </div>
      </Container>
    </section>
  );
}

function SectionCard({ title, description, action, children }) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CheckoutItemRow({ item }) {
  const displayPrice = getDisplayPrice(item);
  const itemSubtotal = getItemSubtotal(item);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || "Product"}
            fill
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Package className="size-8" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-slate-900">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">Qty {Number(item.quantity ?? 0)}</p>
        <p className="mt-3 text-sm font-semibold text-emerald-700">
          Unit {formatCurrency(displayPrice)}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Subtotal</p>
        <p className="mt-1 text-base font-bold text-slate-900">
          {formatCurrency(itemSubtotal)}
        </p>
      </div>
    </div>
  );
}

function AddressCard({ address }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] text-white shadow-sm">
          <MapPin className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {address?.fullName || "—"}
            </h3>
            {address?.isDefault ? (
              <Badge variant="success">Default</Badge>
            ) : null}
          </div>

          <p className="mt-1 text-sm text-slate-500">{address?.phone || "—"}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
        <p className="font-medium text-slate-800">
          {getFullAddress(address) || "—"}
        </p>
        <p>{getAddressCityLine(address) || "—"}</p>
        <p>{address?.country || "India"}</p>
      </div>
    </div>
  );
}

function AddressSheet({
  open,
  onOpenChange,
  addresses,
  draftAddressId,
  onSelectAddress,
  onAddAddress,
}) {
  const hasAddresses = addresses.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Change Address</SheetTitle>
          <SheetDescription>
            Select one of your saved delivery addresses.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-1">
          <Button onClick={onAddAddress} className="h-11 rounded-2xl px-5">
            <Plus className="size-4" />
            Add New Address
          </Button>

          {hasAddresses ? (
            <div className="space-y-3 overflow-y-auto pr-1">
              {addresses.map((address) => {
                const isSelected = draftAddressId === address._id;

                return (
                  <button
                    key={address._id}
                    type="button"
                    onClick={() => onSelectAddress(address._id)}
                    className={cn(
                      "w-full rounded-3xl border p-4 text-left transition",
                      isSelected
                        ? "border-(--color-secondary) bg-emerald-50/70 shadow-[0_18px_50px_-40px_rgba(15,61,46,0.7)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {address.fullName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {address.phone}
                        </p>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="size-5 text-(--color-secondary)" />
                      ) : null}
                    </div>

                    <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
                      <p className="font-medium text-slate-800">
                        {getFullAddress(address)}
                      </p>
                      <p>{getAddressCityLine(address)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
              <Home className="mx-auto size-10 text-slate-400" />
              <p className="mt-4 text-lg font-semibold text-slate-900">
                No delivery address found.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add a delivery address to continue.
              </p>

              <Button onClick={onAddAddress} className="mt-6 h-11 rounded-full px-5">
                <Plus className="size-4" />
                Add New Address
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: isAuthLoading, updateUser } = useAuth();
  const { data, isLoading, isError, error, refetch } = useCart();
  const createOrderMutation = useCreateOrder();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [draftAddressId, setDraftAddressId] = useState(null);

  const cart = data ?? {
    items: [],
    subtotal: 0,
    totalAmount: 0,
    shippingFee: 0,
    hasUnavailableItems: false,
  };

  const items = useMemo(() => cart.items ?? [], [cart.items]);
  const addresses = useMemo(() => user?.addresses ?? [], [user?.addresses]);
  const defaultAddressId = useMemo(() => {
    const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];

    return defaultAddress?._id || null;
  }, [addresses]);
  const committedAddressId = useMemo(() => {
    if (selectedAddressId && addresses.some((address) => address._id === selectedAddressId)) {
      return selectedAddressId;
    }

    return defaultAddressId;
  }, [addresses, defaultAddressId, selectedAddressId]);
  const shippingAmount = Number(cart.shippingFee ?? cart.shippingCharge ?? cart.shipping ?? 0);
  const itemsTotal = Number(cart.subtotal ?? cart.itemsTotal ?? 0);
  const grandTotal = Number(cart.totalAmount ?? cart.total ?? cart.grandTotal ?? itemsTotal + shippingAmount);
  const warningMessage = useMemo(
    () => getWarningMessage(items, cart.hasUnavailableItems),
    [cart.hasUnavailableItems, items]
  );
  const selectedAddress = useMemo(
    () => addresses.find((address) => address._id === committedAddressId) || null,
    [addresses, committedAddressId]
  );
  const hasOutOfStockItems = items.some(
    (item) => !item.deleted && Number(item.stock ?? 0) === 0
  );
  const hasInsufficientStockItems = items.some(
    (item) =>
      !item.deleted && Number(item.stock ?? 0) > 0 && Number(item.quantity ?? 0) > Number(item.stock ?? 0)
  );
  const codValue = cart?.paymentMethods?.cod ?? cart?.codAvailable ?? cart?.enableCod ?? cart?.codEnabled;
  const isCodAvailable = codValue === undefined ? true : Boolean(codValue);
  const validationMessages = [
    items.length === 0 ? "Your cart is empty." : "",
    !selectedAddress ? "Select a delivery address to continue." : "",
    warningMessage,
    hasOutOfStockItems ? "Some items are out of stock." : "",
    hasInsufficientStockItems ? "Some items exceed available stock." : "",
  ].filter(Boolean);

  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: (updatedUser, variables) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });

      const matchedAddress = updatedUser?.addresses?.find(
        (address) => getAddressSignature(address) === getAddressSignature(variables)
      );

      if (matchedAddress) {
        setSelectedAddressId(matchedAddress._id);
        setDraftAddressId(matchedAddress._id);
      }

      setAddressDialogOpen(false);
      toast.success("Address added successfully");
    },
    onError: (mutationError) => {
      toast.error(mutationError?.response?.data?.message ?? "Unable to add address.");
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleAddressSubmit = async (values) => {
    const payload = {
      ...values,
      addressLine2: values.addressLine2?.trim() || undefined,
      country: values.country?.trim(),
    };

    await addAddressMutation.mutateAsync(payload);
  };

  const handlePlaceOrder = async () => {
    if (validationMessages.length > 0 || !selectedAddress) {
      return;
    }

    const payload = {
      paymentMethod,
      addressId: selectedAddress._id,
    };

    createOrderMutation.mutate(payload, {
      onSuccess: async (orderResponse) => {
        if (paymentMethod === "razorpay") {
          const razorpayOrderId = orderResponse?.razorpayOrder?.id;
          const razorpayAmount = orderResponse?.razorpayOrder?.amount;
          const razorpayCurrency = orderResponse?.razorpayOrder?.currency;
          const razorpayKey = orderResponse?.key;

          if (!razorpayOrderId || !razorpayAmount || !razorpayKey) {
            toast.error("Unable to initiate payment. Please try again.");
            return;
          }

          try {
            await openRazorpayCheckout({
              keyId: razorpayKey,
              orderId: razorpayOrderId,
              amount: razorpayAmount,
              currency: razorpayCurrency,
              handler: async (response) => {
                try {
                  await verifyPayment(response);
                  queryClient.invalidateQueries({ queryKey: queryKeys.orders });
                  queryClient.invalidateQueries({ queryKey: queryKeys.cart });
                  queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
                  toast.success("Payment verified successfully");
                } catch (paymentError) {
                  toast.error(
                    paymentError?.response?.data?.message ??
                      paymentError?.message ??
                      "Unable to verify payment."
                  );
                }
              },
              modal: {
                ondismiss: () => {
                  toast.info("Payment was cancelled.");
                },
              },
            });
          } catch (paymentError) {
            toast.error(paymentError?.message ?? "Unable to open payment gateway.");
          }

          return;
        }

        toast.success("Order placed successfully");
      },
    });
  };

  if (isAuthLoading || isLoading) {
    return <CheckoutSkeleton />;
  }

  if (!isAuthenticated) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <section className="bg-slate-50 pt-30 pb-14">
        <Container>
          <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-8 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
              <AlertTriangle className="size-6" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
              Failed to load checkout
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {error?.response?.data?.message ?? "Something went wrong. Please try again."}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="mt-6 h-11 rounded-full border-rose-200 bg-white px-5 text-rose-700 hover:bg-rose-50"
            >
              <Loader2 className="mr-2 size-4 animate-spin" />
              Retry
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-slate-50 pt-30 pb-14">
        <Container>
          <EmptyCartState />
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <Container>
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
            Checkout
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Review and place your order
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Confirm your delivery details, review the items, and choose how you want to pay.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <SectionCard
              title="Delivery Address"
              description="Choose the shipping address for this order."
              action={
                addresses.length > 0 ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => setAddressSheetOpen(true)}>
                    Change Address
                  </Button>
                ) : null
              }
            >
              {selectedAddress ? (
                <AddressCard address={selectedAddress} />
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                  <Home className="mx-auto size-10 text-slate-400" />
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    No delivery address found.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add a delivery address to continue.
                  </p>

                  <Button onClick={() => setAddressDialogOpen(true)} className="mt-6 h-11 rounded-full px-5">
                    <Plus className="size-4" />
                    Add New Address
                  </Button>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Order Review"
              description="Items will be purchased exactly as shown below."
            >
              <div className="space-y-4">
                {items.map((item) => (
                  <CheckoutItemRow key={item.productId} item={item} />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Payment Method"
              description="Choose how you would like to complete this purchase."
            >
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.value;
                  const isDisabled = method.value === "cod" && !isCodAvailable;

                  return (
                    <label
                      key={method.value}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-3xl border p-5 transition",
                        isSelected
                          ? "border-(--color-secondary) bg-emerald-50/60 shadow-[0_18px_50px_-40px_rgba(15,61,46,0.55)]"
                          : "border-slate-200 bg-white hover:border-slate-300",
                        isDisabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method.value)}
                        disabled={isDisabled}
                        className="mt-1 size-4 accent-(--color-secondary)"
                      />

                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-(--color-secondary)">
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-900">
                            {method.title}
                          </p>
                          {method.value === "razorpay" ? (
                            <Badge variant="success">Recommended</Badge>
                          ) : null}
                          {isDisabled ? <Badge variant="warning">Unavailable</Badge> : null}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {method.subtitle}
                        </p>

                        {method.helper ? (
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-(--color-secondary)">
                            {method.helper}
                          </p>
                        ) : null}

                        {isDisabled ? (
                          <p className="mt-2 text-sm text-amber-700">
                            Cash on delivery is currently unavailable.
                          </p>
                        ) : null}
                      </div>
                    </label>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>Final order total before placing the order.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total</span>
                    <span>{formatCurrency(itemsTotal)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-700">
                      {shippingAmount > 0 ? formatCurrency(shippingAmount) : "Free"}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl font-bold text-slate-900">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>

                  {validationMessages.length > 0 ? (
                    <div className="space-y-3 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        <div className="space-y-1">
                          {validationMessages.map((message) => (
                            <p key={message}>{message}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <Button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={validationMessages.length > 0 || createOrderMutation.isPending}
                    className="h-12 w-full rounded-full px-6"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Processing...
                      </>
                    ) : paymentMethod === "razorpay" ? (
                      "Proceed to Payment"
                    ) : (
                      "Place Order & Continue"
                    )}
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    <ShieldCheck className="mr-1 inline size-4 text-emerald-600" />
                    Secure checkout powered by your selected payment method.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-500 shadow-sm">
              <p>
                Need to review your cart first? <Link href="/cart" className="font-medium text-(--color-secondary)">Go back to cart</Link>.
              </p>
            </div>
          </div>
        </div>
      </Container>

      <AddressSheet
        open={addressSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAddressId(draftAddressId);
          } else {
            setDraftAddressId(committedAddressId);
          }

          setAddressSheetOpen(open);
        }}
        addresses={addresses}
        draftAddressId={draftAddressId}
        onSelectAddress={setDraftAddressId}
        onAddAddress={() => {
          setAddressDialogOpen(true);
        }}
      />

      <AddressFormDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        mode="add"
        initialValues={defaultAddressValues}
        onSubmit={handleAddressSubmit}
        isPending={addAddressMutation.isPending}
      />
    </section>
  );
}